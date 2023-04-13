# Local build script / UI Preparation Script for Release

# Build Frontend
cd ./ui/ || exit
npm i
npm run build

# Build Backend
cd ..
go get
go build