#!/usr/bin/env python3
"""
Détecte les textes qui s'affichent DEUX FOIS sur une même page du site.

POURQUOI CE SCRIPT EXISTE. Le 29/08/2026, la direction a relevé sur la page
Hébergements un paragraphe imprimé deux fois à quelques centimètres d'écart
(« 4 maisons en duplex entièrement équipées… »). La recherche à la main a
trouvé dix-sept cas du même ordre, répartis sur dix pages et trois langues :
un chapeau de section répétant celui du hero, un paragraphe de dictionnaire
réutilisé sous deux clés différentes, un tableau récapitulant mot pour mot la
liste posée à côté de lui. Aucun n'était visible en lisant le code : ils ne se
voient qu'une fois la page assemblée. D'où ce script, qui lit la page finie.

IL LIT LE HTML PRÉRENDU, ET NON LE SERVEUR DE DÉVELOPPEMENT. Le rendu de
`next dev` diffère du prérendu : replis de dictionnaire, données de chambres
et JSON-LD n'y sont pas toujours ceux qui partent en production. La seule
source de vérité est .next/server/app/**/*.html, produit par `npm run build`.

CE QU'IL N'EST PAS. Ce n'est pas un correcteur de style. Une page peut
légitimement répéter un texte : un bouton « Réserver » sous chaque chambre,
deux chambres au même tarif dans deux tableaux, une mention d'avis qui ne
diffère que par la date. Ces cas sont classés à part (voir CATEGORIES) et
tus par défaut : un contrôle qui crie au loup finit ignoré. Seule la PROSE
répétée fait échouer le script.

CE QU'IL ÉCARTE, ET POURQUOI
  - <script>, <style>, <svg>, <head> : ce n'est pas du texte lu.
  - Tout sous-arbre aria-hidden="true" : le ruban d'avis de la page d'accueil
    duplique ses cartes pour défiler sans couture, et marque la seconde copie
    comme décorative. Sans cette exclusion, seize avis remontaient en double.
  - Tout sous-arbre .sr-only : texte écrit POUR les lecteurs d'écran, qui
    répète à dessein ce que la mise en page dit autrement.
  - L'habillage du site (barre du haut, pied de page, bandeau cookies).
    Il n'est pas toujours dans un <header>/<footer> — la barre du haut est un
    <div> flottant — mais il a une signature sûre : il figure sur presque
    toutes les pages. Ce qui se répète d'une page à l'autre n'est pas une
    répétition DANS la page.

Usage :
    npm run verifier:repetitions              # après npm run build
    python3 scripts/verifier-repetitions.py   # idem, sans npm
    python3 scripts/verifier-repetitions.py --tout        # toutes catégories
    python3 scripts/verifier-repetitions.py --page fr/    # filtre par chemin
    python3 scripts/verifier-repetitions.py <autre-dossier-de-html>

Code de sortie : 0 si aucune prose répétée, 1 sinon. Utilisable en intégration
continue, juste après le build.
"""
import argparse
import html
import re
import sys
import unicodedata
from collections import defaultdict
from html.parser import HTMLParser
from pathlib import Path

RACINE_DEFAUT = Path(".next/server/app")

# Balises dont le contenu n'est pas du texte lu par un visiteur.
IGNOREES = {"script", "style", "noscript", "svg", "template", "head", "title"}

# Balises qui ferment un bloc de texte. Le texte est accumulé puis vidé à
# chaque frontière, ce qui donne des blocs comparables à ce que l'œil isole.
BLOCS = {
    "p", "div", "section", "article", "aside", "main", "header", "footer", "nav",
    "h1", "h2", "h3", "h4", "h5", "h6", "li", "td", "th", "dd", "dt", "tr",
    "figcaption", "blockquote", "figure", "form", "label", "button", "a",
    "br", "hr", "option", "summary", "details",
}

# Balises orphelines : jamais empilées, donc jamais dépilées.
ORPHELINES = {"br", "hr", "img", "input", "meta", "link", "source", "area", "col"}

# Balises d'habillage repérables par leur nom. La détection par ubiquité
# (voir `blocs_ubiquitaires`) attrape le reste.
HABILLAGE = {"header", "nav", "footer"}

# CATÉGORIES : à quoi tient une répétition, et faut-il s'en émouvoir.
# La clé est la catégorie, la valeur le vocabulaire de classes du site qui la
# désigne. Ce vocabulaire est celui de src/app/globals.css et des composants ;
# s'il change, cette table est à reprendre.
CATEGORIES = {
    # Boutons d'action. « Réserver » sous chaque chambre est un usage, pas
    # une redite.
    "action": {"ge-cta"},
    # Tableaux récapitulatifs (RecapRows) : les lignes, et le titre du tableau.
    # Deux chambres au même tarif produisent deux lignes identiques dans deux
    # tableaux différents ; deux excursions produisent deux titres « Aperçu ».
    # `ge-rows__titre` n'existe QUE pour cette distinction : sans lui, le titre
    # d'un tableau est indiscernable du chapeau d'une vraie section.
    "tableau": {"ge-row", "ge-rows__titre"},
    # AVIS CLIENTS, texte compris. Deux clients peuvent écrire « merci à toute
    # l'équipe » : c'est leur phrase, pas la nôtre, et elle est reproduite
    # telle quelle, fautes comprises. Ce contrôle ne doit JAMAIS conduire à
    # retoucher un avis — ni son texte, ni le nom de son auteur. Les mentions
    # (« Avis Google, mars 2026 · ») et le lien de renvoi sont, eux,
    # structurellement parallèles : un par avis.
    "avis": {
        "lh-avis__texte", "lh-avis__nom", "lh-avis__lieu",
        "lh-avis__mentions", "lh-avis__lien",
    },
    # Chiffres. `tabular-nums` marque dans tout le site ce qui s'aligne en
    # colonne : tarifs des cartes, numéros d'étape, compteurs. Deux chambres
    # au même prix affichent forcément le même montant.
    "chiffre": {"tabular-nums"},
}
# Régions d'état (aria-live) : compteur de galerie « 1 / 6 », messages de
# statut. Ce n'est pas de la prose, et deux galeries en donnent forcément deux.
CATEGORIE_ETAT = "etat"

# Deux lignes d'un même barème : mêmes mots, autres nombres. « De 60 à 15 jours
# avant l'arrivée : 20 % » et « De 15 à 5 jours avant l'arrivée : 70 % » se
# ressemblent parce qu'elles doivent se ressembler.
CATEGORIE_BAREME = "bareme"

# Répétitions examinées et acceptées, consignées avec leur motif.
CATEGORIE_ACCEPTEE = "acceptee"
FICHIER_ACCEPTEES = Path(__file__).with_name("repetitions-acceptees.txt")

# Seuls les constats de cette catégorie font échouer le script.
CATEGORIE_PROSE = "prose"

# Longueurs minimales. En deçà, le bruit l'emporte : « Accès », « Tarifs »,
# « 2026 » se répètent sans que cela veuille dire quoi que ce soit.
MIN_CARACTERES_BLOC = 12
MIN_MOTS_PHRASE = 4
MIN_MOTS_PROCHE = 7
SEUIL_JACCARD = 0.6

# Inclusion : une phrase courte dont presque tous les mots se retrouvent dans
# une phrase plus longue de la même page. Le cas typique est la liste à puces
# qui reprend, en abrégé, ce que le paragraphe d'à côté vient d'écrire ; la
# ressemblance globale (Jaccard) reste basse parce que le paragraphe est long,
# et le défaut passait au travers.
MIN_MOTS_INCLUSION = 6
SEUIL_INCLUSION = 0.85

# Mots trop courants pour peser dans une comparaison : deux phrases sans
# rapport partagent leurs articles et leurs prépositions.
VIDES = {
    # français
    "le", "la", "les", "un", "une", "des", "du", "de", "d", "l", "au", "aux",
    "et", "ou", "à", "a", "en", "dans", "pour", "par", "sur", "avec", "sans",
    "que", "qui", "ce", "cette", "ces", "son", "sa", "ses", "nos", "notre",
    "nous", "vous", "est", "sont", "plus", "ne", "pas", "se", "y", "il", "elle",
    # anglais
    "the", "of", "and", "to", "in", "for", "an", "is", "are", "our", "with",
    "on", "at", "by", "we", "you", "it", "its", "from", "as", "that", "this",
    # espagnol
    "el", "los", "las", "una", "y", "o", "para", "por", "con", "su", "sus",
    "es", "son", "se", "del", "al", "lo", "nuestro", "nuestra", "nuestros",
}

# Un bloc présent sur au moins cette fraction des pages est de l'habillage.
FRACTION_UBIQUITE = 0.9


class Extracteur(HTMLParser):
    """Découpe une page en blocs de texte, en gardant d'où vient chacun."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.pile = []       # (balise, ignorée, cachée, habillage, catégorie)
        self.blocs = []      # (texte, habillage, catégorie)
        self.tampon = []
        self.prof_ignoree = 0
        self.prof_cachee = 0
        self.prof_habillage = 0
        self.categories = []  # pile des catégories en cours

    def _vider(self):
        texte = " ".join("".join(self.tampon).split())
        if texte:
            categorie = self.categories[-1] if self.categories else CATEGORIE_PROSE
            self.blocs.append((texte, self.prof_habillage > 0, categorie))
        self.tampon = []

    @staticmethod
    def _categorie(attributs):
        classe = attributs.get("class", "")
        for nom, marqueurs in CATEGORIES.items():
            if any(m in classe for m in marqueurs):
                return nom
        if attributs.get("aria-live"):
            return CATEGORIE_ETAT
        return None

    def handle_starttag(self, balise, attrs):
        attributs = dict(attrs)
        ignoree = balise in IGNOREES
        classe = attributs.get("class", "")
        cachee = attributs.get("aria-hidden") == "true" or "sr-only" in classe
        habillage = balise in HABILLAGE
        categorie = self._categorie(attributs)

        if balise in BLOCS or ignoree or cachee or categorie:
            self._vider()
        if ignoree:
            self.prof_ignoree += 1
        if cachee:
            self.prof_cachee += 1
        if habillage:
            self.prof_habillage += 1
        if categorie:
            self.categories.append(categorie)

        if balise not in ORPHELINES:
            self.pile.append((balise, ignoree, cachee, habillage, categorie))

    def handle_startendtag(self, balise, attrs):
        """<img />, <br /> : ouverture SANS fermeture.

        Sans cette surcharge, html.parser appelle handle_endtag pour une
        balise jamais empilée ; la boucle de dépilement vidait alors toute la
        pile et l'on perdait le contexte aria-hidden du ruban d'avis, qui
        remontait seize faux positifs.
        """
        self.handle_starttag(balise, attrs)
        if balise not in ORPHELINES:
            self.handle_endtag(balise)

    def handle_endtag(self, balise):
        # Fermeture sans ouverture correspondante : on l'ignore plutôt que de
        # vider la pile (même raison que ci-dessus).
        if not any(b == balise for b, *_ in self.pile):
            return
        while self.pile:
            b, ignoree, cachee, habillage, categorie = self.pile.pop()
            if b in BLOCS or ignoree or cachee or categorie:
                self._vider()
            if ignoree:
                self.prof_ignoree -= 1
            if cachee:
                self.prof_cachee -= 1
            if habillage:
                self.prof_habillage -= 1
            if categorie and self.categories:
                self.categories.pop()
            if b == balise:
                break

    def handle_data(self, donnees):
        if self.prof_ignoree or self.prof_cachee:
            return
        self.tampon.append(donnees)

    def close(self):
        super().close()
        self._vider()


ESPACES_FINS = (" ", " ", " ")
COUPE_PHRASE = re.compile(r"(?<=[.!?;])\s+")


def normaliser(texte):
    """Forme comparable : casse, apostrophes, guillemets et espaces unifiés.

    Le site mêle apostrophes courbes et droites, espaces insécables fines et
    normales : deux occurrences du même texte n'ont pas les mêmes octets.
    """
    texte = html.unescape(texte)
    texte = unicodedata.normalize("NFKC", texte).lower()
    texte = texte.replace("’", "'").replace("‘", "'")
    for espace in ESPACES_FINS:
        texte = texte.replace(espace, " ")
    texte = re.sub(r"[“”«»\"]", "", texte)
    texte = re.sub(r"[^\w\s'·%€&/×,.:;!?()-]", " ", texte, flags=re.UNICODE)
    return " ".join(texte.split())


def squelette(texte):
    """Le texte privé de ses nombres.

    Deux lignes d'un même barème — d'annulation, de tarifs, d'horaires — ne
    diffèrent que par leurs chiffres. Une fois ceux-ci retirés, elles se
    confondent : c'est la signature d'un tableau, pas d'une redite.
    """
    return " ".join(re.sub(r"\d+", " ", texte).split())


def phrases(texte):
    return [p.strip(" .;:!?") for p in COUPE_PHRASE.split(texte) if p.strip()]


def repetitions_acceptees():
    """Les cas examinés et tolérés, un texte normalisé par ligne.

    Le fichier est volontairement littéral : si la formulation change, la
    tolérance tombe et le cas revient à l'examen. C'est le comportement voulu.
    """
    if not FICHIER_ACCEPTEES.exists():
        return frozenset()
    lignes = FICHIER_ACCEPTEES.read_text(encoding="utf-8").splitlines()
    formes = set()
    for ligne in lignes:
        if not ligne.strip() or ligne.lstrip().startswith("#"):
            continue
        norme = normaliser(ligne)
        # Les blocs gardent leur ponctuation finale, les phrases la perdent
        # (voir `phrases`). On enregistre les deux formes, faute de quoi une
        # entrée recopiée du dictionnaire — donc avec son point — ne
        # correspondrait jamais à la phrase que le contrôle compare.
        formes.add(norme)
        formes.add(norme.strip(" .;:!?"))
    return frozenset(formes)


def mots(texte):
    return set(re.findall(r"\w+", texte))


def mots_pleins(texte):
    """Les mots qui portent le sens : sans articles, prépositions, auxiliaires."""
    return {m for m in re.findall(r"\w+", texte) if m not in VIDES and len(m) > 1}


def blocs_de(chemin):
    extracteur = Extracteur()
    extracteur.feed(chemin.read_text(encoding="utf-8", errors="replace"))
    extracteur.close()
    return extracteur.blocs


def blocs_ubiquitaires(fichiers):
    """Les blocs présents sur (presque) toutes les pages : l'habillage."""
    compte = defaultdict(int)
    for fichier in fichiers:
        vus = {normaliser(t) for t, hab, _ in blocs_de(fichier) if not hab}
        for n in vus:
            compte[n] += 1
    seuil = max(2, int(FRACTION_UBIQUITE * len(fichiers)))
    return frozenset(n for n, c in compte.items() if c >= seuil)


def analyser(chemin, ubiquitaires, acceptees=frozenset()):
    """Constats d'une page : (categorie, genre, compte_ou_score, textes)."""
    corps = [
        (normaliser(t), t, cat)
        for t, habillage, cat in blocs_de(chemin)
        if not habillage
    ]
    corps = [(n, t, c) for n, t, c in corps if n and n not in ubiquitaires]

    constats = []

    # 1. Blocs entiers identiques. Le cas le plus net : le même paragraphe,
    #    le même chapeau, deux fois dans la page.
    groupes = defaultdict(list)
    for norme, texte, categorie in corps:
        if len(norme) >= MIN_CARACTERES_BLOC:
            groupes[(norme, categorie)].append(texte)
    deja_signales = set()
    for (norme, categorie), textes in groupes.items():
        if len(textes) > 1:
            if norme in acceptees:
                categorie = CATEGORIE_ACCEPTEE
            constats.append((categorie, "BLOC", len(textes), [textes[0]]))
            deja_signales.add(norme)

    # 2. Phrases identiques logées dans des blocs différents. Attrape la
    #    reprise partielle : une phrase du chapô rejouée dans un paragraphe.
    compte_phrases = defaultdict(int)
    categorie_phrase = {}
    for norme, _texte, categorie in corps:
        if norme in deja_signales:
            continue
        for phrase in phrases(norme):
            if len(re.findall(r"\w+", phrase)) >= MIN_MOTS_PHRASE:
                compte_phrases[phrase] += 1
                categorie_phrase.setdefault(phrase, categorie)
    for phrase, compte in compte_phrases.items():
        if compte > 1:
            categorie = categorie_phrase[phrase]
            if phrase in acceptees:
                categorie = CATEGORIE_ACCEPTEE
            constats.append((categorie, "PHRASE", compte, [phrase]))

    # 3. Phrases très proches sans être identiques : la reformulation, celle
    #    qu'on ne voit qu'en lisant la page à voix haute.
    uniques = [
        (p, mots(p))
        for p, c in compte_phrases.items()
        if c == 1 and len(re.findall(r"\w+", p)) >= MIN_MOTS_PROCHE
    ]
    deja_apparies = set()
    for i in range(len(uniques)):
        for j in range(i + 1, len(uniques)):
            a, mots_a = uniques[i]
            b, mots_b = uniques[j]
            union = len(mots_a | mots_b)
            if not union:
                continue
            score = len(mots_a & mots_b) / union
            if score < SEUIL_JACCARD:
                continue
            categorie = categorie_phrase.get(a, CATEGORIE_PROSE)
            if categorie_phrase.get(b) != categorie:
                categorie = CATEGORIE_PROSE
            # Deux lignes d'un même barème : identiques une fois les nombres
            # retirés. Il en faut assez pour que la coïncidence soit exclue.
            os_a, os_b = squelette(a), squelette(b)
            if os_a == os_b and len(re.findall(r"\w+", os_a)) >= MIN_MOTS_PROCHE:
                categorie = CATEGORIE_BAREME
            if a in acceptees and b in acceptees:
                categorie = CATEGORIE_ACCEPTEE
            constats.append((categorie, "PROCHE", round(score, 2), [a, b]))
            deja_apparies.add(a)
            deja_apparies.add(b)

    # 4. Inclusion : une phrase courte presque entièrement contenue dans une
    #    phrase plus longue. C'est la forme que prend la liste à puces qui
    #    résume le paragraphe posé à côté d'elle — la ressemblance globale
    #    reste faible, puisque le paragraphe dit beaucoup plus, et les trois
    #    mesures précédentes la laissaient passer.
    candidates = [
        (p, mots_pleins(p), len(re.findall(r"\w+", p)))
        for p, c in compte_phrases.items()
        if c == 1
    ]
    for courte, mots_courte, taille_courte in candidates:
        if taille_courte < MIN_MOTS_INCLUSION or not mots_courte:
            continue
        if courte in deja_apparies:
            continue
        for longue, mots_longue, taille_longue in candidates:
            if longue is courte or taille_longue <= taille_courte:
                continue
            couverture = len(mots_courte & mots_longue) / len(mots_courte)
            if couverture < SEUIL_INCLUSION:
                continue
            # Si l'un des deux côtés est un tableau, un bouton ou une mention
            # d'avis, l'inclusion est dans l'ordre des choses : un tableau
            # récapitulatif EST censé reprendre en abrégé ce que la prose
            # développe. C'est l'inverse du cas qui nous occupe — deux textes
            # courants qui se redisent — d'où cette règle propre à l'inclusion.
            cat_courte = categorie_phrase.get(courte, CATEGORIE_PROSE)
            cat_longue = categorie_phrase.get(longue, CATEGORIE_PROSE)
            categorie = CATEGORIE_PROSE
            for candidate in (cat_courte, cat_longue):
                if candidate != CATEGORIE_PROSE:
                    categorie = candidate
                    break
            if courte in acceptees and longue in acceptees:
                categorie = CATEGORIE_ACCEPTEE
            constats.append(
                (categorie, "INCLUS", round(couverture, 2), [courte, longue])
            )
            break  # un seul signalement par phrase courte

    return constats


def main():
    analyseur = argparse.ArgumentParser(
        description="Textes affichés deux fois sur une même page du site.",
    )
    analyseur.add_argument(
        "racine", nargs="?", default=str(RACINE_DEFAUT),
        help="dossier des pages prérendues (défaut : .next/server/app)",
    )
    analyseur.add_argument(
        "--tout", action="store_true",
        help="montrer aussi les catégories tues par défaut "
             "(boutons, tableaux, mentions d'avis, compteurs)",
    )
    analyseur.add_argument(
        "--page", default="",
        help="ne traiter que les pages dont le chemin contient cette chaîne "
             "(ex. : --page fr/)",
    )
    options = analyseur.parse_args()

    racine = Path(options.racine)
    if not racine.is_dir():
        print(
            f"Dossier introuvable : {racine}\n"
            "Ce contrôle lit les pages prérendues. Lancez d'abord « npm run build ».",
            file=sys.stderr,
        )
        return 2

    # _global-error et _not-found sont des coquilles de secours, pas des pages
    # éditoriales : elles n'ont pas de corps à comparer.
    fichiers = [
        f for f in sorted(racine.rglob("*.html"))
        if f.name not in {"_global-error.html", "_not-found.html"}
    ]
    if not fichiers:
        print(f"Aucune page .html sous {racine}.", file=sys.stderr)
        return 2

    ubiquitaires = blocs_ubiquitaires(fichiers)
    acceptees = repetitions_acceptees()
    if options.page:
        fichiers = [f for f in fichiers if options.page in str(f.relative_to(racine))]

    total_prose = 0
    total_tus = defaultdict(int)

    for fichier in fichiers:
        constats = analyser(fichier, ubiquitaires, acceptees)
        montres = []
        for categorie, genre, valeur, textes in constats:
            if categorie == CATEGORIE_PROSE or options.tout:
                montres.append((categorie, genre, valeur, textes))
            else:
                total_tus[categorie] += 1
            if categorie == CATEGORIE_PROSE:
                total_prose += 1
        if not montres:
            continue

        print("=" * 78)
        print(fichier.relative_to(racine))
        # Blocs d'abord (les plus nets), puis phrases, puis reformulations.
        ordre = {"BLOC": 0, "PHRASE": 1, "INCLUS": 2, "PROCHE": 3}
        for categorie, genre, valeur, textes in sorted(
            montres, key=lambda c: (ordre[c[1]], -float(c[2]))
        ):
            marque = "" if categorie == CATEGORIE_PROSE else f" ({categorie})"
            if genre == "PROCHE":
                print(f"  [PROCHE {valeur}]{marque}")
                print(f"      A : {textes[0][:170]}")
                print(f"      B : {textes[1][:170]}")
            elif genre == "INCLUS":
                print(f"  [INCLUS {valeur}]{marque}")
                print(f"      courte : {textes[0][:170]}")
                print(f"      longue : {textes[1][:170]}")
            else:
                print(f"  [{genre} ×{valeur}]{marque} {textes[0][:180]}")

    print("=" * 78)
    print(f"{total_prose} répétition(s) de prose sur {len(fichiers)} page(s).")
    if total_tus and not options.tout:
        detail = ", ".join(f"{n} {c}" for c, n in sorted(total_tus.items()))
        print(f"Tues car structurellement parallèles : {detail}. « --tout » les montre.")
    if total_prose:
        print("\nChaque ligne ci-dessus est un texte que le visiteur lit deux fois.")
    return 1 if total_prose else 0


if __name__ == "__main__":
    sys.exit(main())
