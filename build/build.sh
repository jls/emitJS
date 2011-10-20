# Minify the compiled js
printf "\tMinifying\n"
java -jar ./build/compiler.jar --js src/emit.js --js_output_file build/emit.minified.js 

printf "\tLicensing\n"
cat src/license.txt > dist/emit.min.js
cat build/emit.minified.js >> dist/emit.min.js

printf "\tCleaning up\n"
rm build/emit.minified.js

