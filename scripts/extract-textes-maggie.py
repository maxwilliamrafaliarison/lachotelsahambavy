#!/usr/bin/env python3
"""
Extraction des textes du document éditorial de Maggie (.docx).

Le document est en MODE RÉVISION (507 insertions, 365 suppressions) :
la traduction anglaise a été retravaillée par une rédactrice
professionnelle (Jennifer Manzanillo), et ses corrections n'ont pas été
acceptées dans le fichier.

Un copier-coller naïf — ou une extraction par expressions régulières —
concatène le texte supprimé ET le texte inséré, ce qui produit du charabia :
    « If there is a true sanctuary on Eartha paradise on Earth »
    « to take over the family venture family adventure »

Ce script « accepte les modifications » : il supprime les nœuds <w:del>
(y compris imbriqués dans des <w:ins>) via un vrai parseur XML, puis
extrait le texte paragraphe par paragraphe.

Usage :
    python3 scripts/extract-textes-maggie.py <fichier.docx> [sortie.json]
"""
import json
import sys
import zipfile
import xml.etree.ElementTree as ET

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"


def texte_du_paragraphe(p: ET.Element) -> str:
    """Texte final d'un paragraphe : <w:t> uniquement, <w:delText> ignoré."""
    return "".join(n.text or "" for n in p.iter(f"{W}t")).strip()


def supprimer_revisions(racine: ET.Element) -> None:
    """Retire récursivement tous les nœuds <w:del> (texte supprimé)."""
    for parent in racine.iter():
        for enfant in list(parent):
            if enfant.tag == f"{W}del":
                parent.remove(enfant)


def extraire(chemin_docx: str) -> list[str]:
    with zipfile.ZipFile(chemin_docx) as z:
        racine = ET.fromstring(z.read("word/document.xml"))
    # Plusieurs passes : une suppression peut en révéler une autre (imbrication).
    for _ in range(5):
        avant = sum(1 for _ in racine.iter(f"{W}del"))
        if avant == 0:
            break
        supprimer_revisions(racine)
    paragraphes = [texte_du_paragraphe(p) for p in racine.iter(f"{W}p")]
    return [t for t in paragraphes if t]


def extraire_commentaires(chemin_docx: str) -> list[dict]:
    """Notes de la rédactrice (consignes / questions laissées à Maggie)."""
    with zipfile.ZipFile(chemin_docx) as z:
        if "word/comments.xml" not in z.namelist():
            return []
        racine = ET.fromstring(z.read("word/comments.xml"))
    out = []
    for c in racine.iter(f"{W}comment"):
        texte = "".join(n.text or "" for n in c.iter(f"{W}t")).strip()
        if texte:
            out.append({"auteur": c.get(f"{W}author", "?"), "texte": texte})
    return out


def main() -> None:
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    docx = sys.argv[1]
    sortie = sys.argv[2] if len(sys.argv) > 2 else "textes-maggie.json"

    paragraphes = extraire(docx)
    commentaires = extraire_commentaires(docx)

    with open(sortie, "w", encoding="utf-8") as f:
        json.dump(
            {"paragraphes": paragraphes, "commentaires": commentaires},
            f,
            ensure_ascii=False,
            indent=1,
        )

    print(f"{len(paragraphes)} paragraphes extraits (révisions acceptées)")
    print(f"{len(commentaires)} commentaires de la rédactrice")
    print(f"→ {sortie}")


if __name__ == "__main__":
    main()
