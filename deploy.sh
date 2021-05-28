#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

git_origin_url=$(git remote get-url origin)

# navigate into the build output directory
cd dist

[[ -d .git ]] || git init
git add -A
git commit -m 'deploy' && true

git push -f $git_origin_url master:gh-pages

cd -
