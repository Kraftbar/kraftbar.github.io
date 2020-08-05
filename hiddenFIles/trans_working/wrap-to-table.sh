#!/bin/bash


echo -n "" > output
filename='input'
n=1
while read line; do
./gt.sh line >> output
n=$((n+1))
done < $filename



cat output | awk -v FS='\t' '
    BEGIN{print "<table>"} 
    {printf("<tr><td>%s</td><td>%s</td><td>%s</td></tr>\n",$1,$2,$3)}
    END{print "</table>"}
'
