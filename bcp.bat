rm -rv  d:\NBTest\chupad\src\main\resources\public\*

call ng build --prod -c production

echo "copying "
cp -v -r  dist\*  d:\NBTest\chupad\src\main\resources\public

echo "done."
