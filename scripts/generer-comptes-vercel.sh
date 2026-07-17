#!/usr/bin/env bash
#
# Génère les 2 variables d'environnement de l'espace équipe et les copie
# dans le presse-papiers, prêtes à coller dans Vercel.
#
#   Usage :  bash scripts/generer-comptes-vercel.sh
#
# Les mots de passe sont saisis en aveugle : ils ne s'affichent pas, ne
# passent pas par l'historique du shell et ne sont jamais écrits sur disque.
# Seuls leurs hash bcrypt (irréversibles) sortent d'ici.
#
# À coller ensuite dans Vercel → Settings → Environment Variables → champ
# « Key » (il accepte un collage .env), en cochant Production ET Preview.
# Puis Deployments → ··· → Redeploy.

set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f scripts/hash-admin-password.mjs ]; then
  echo "Erreur : lancez ce script depuis le dépôt lachotelsahambavy." >&2
  exit 1
fi

# — Les comptes. Modifier les e-mails/noms ici si besoin. —
#   Format : e-mail|Nom affiché|role   (role = admin | reception)
COMPTES=(
  "maggie@lachotel.com|Maggie Leong|admin"
  "max.fianar@gmail.com|Max|admin"
  "toky@lachotel.com|Toky|reception"
  "tata@lachotel.com|Tata|reception"
)

echo "Espace équipe — génération des comptes"
echo "Les mots de passe ne s'affichent pas. 8 caractères minimum."
echo

JSON="["
for i in "${!COMPTES[@]}"; do
  IFS='|' read -r email nom role <<< "${COMPTES[$i]}"

  while true; do
    read -rsp "Mot de passe pour $nom ($role) : " PWD1 && echo
    if [ ${#PWD1} -lt 8 ]; then
      echo "  → trop court (8 caractères minimum), on recommence." >&2
      continue
    fi
    read -rsp "  confirmez : " PWD2 && echo
    if [ "$PWD1" != "$PWD2" ]; then
      echo "  → les deux saisies diffèrent, on recommence." >&2
      continue
    fi
    break
  done

  HASH=$(node scripts/hash-admin-password.mjs "$PWD1")
  if [ -z "$HASH" ]; then
    echo "Erreur : le hash de $nom est vide, abandon." >&2
    exit 1
  fi

  [ "$i" -gt 0 ] && JSON="$JSON,"
  JSON="$JSON{\"email\":\"$email\",\"name\":\"$nom\",\"role\":\"$role\",\"hash\":\"$HASH\"}"
  unset PWD1 PWD2 HASH
done
JSON="$JSON]"

SECRET=$(openssl rand -base64 32)
SORTIE="AUTH_SECRET=$SECRET
ADMIN_USERS_JSON=$JSON"

printf '%s' "$SORTIE" | pbcopy

echo
echo "✅ Copié dans le presse-papiers : 2 variables, ${#COMPTES[@]} comptes."
echo
echo "   1. Vercel → Settings → Environment Variables"
echo "   2. Collez (Cmd+V) dans le champ « Key »  — il découpe les 2 lignes tout seul"
echo "   3. Cochez Production ET Preview, puis Save"
echo "   4. Deployments → le plus récent → ··· → Redeploy"
echo
echo "   (aperçu masqué — le vrai contenu est dans le presse-papiers)"
printf '%s\n' "$SORTIE" | sed 's/\(AUTH_SECRET=\).*/\1«32 caractères aléatoires»/; s/"hash":"[^"]*"/"hash":"«bcrypt»"/g'
