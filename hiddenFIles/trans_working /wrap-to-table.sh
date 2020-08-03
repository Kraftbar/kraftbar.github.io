cat output | awk -v FS='\t' '
    BEGIN{print "<table>"} 
    {printf("<tr><td>%s</td><td>%s</td><td>%s</td></tr>\n",$1,$2,$3)}
    END{print "</table>"}
'
