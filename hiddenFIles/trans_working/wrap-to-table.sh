#!/bin/bash


echo -n "" > output

while IFS= read  -r line
do
./gt.sh $line >> output
done < input


cat output | awk -v FS='\t' '
    BEGIN{print "<table>"} 
    {printf("<tr><td>%s</td><td>%s</td><td>%s</td></tr>\n",$1,$2,$3)}
    END{print "</table>"}
'
