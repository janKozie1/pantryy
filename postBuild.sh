#! /bin/bash

mkdir ./pantryy_backend/dist/static
cp ./pantryy_frontend/public/index.html ./pantryy_backend/dist/static/index.html
cp -r ./pantryy_frontend/public/static/. ./pantryy_backend/dist/static/
