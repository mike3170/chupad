select max(substr(sheet_no, -3, 3)) seq
									from abs_bar_code_temp where
   								substr(sheet_no, 1, 8) = '20180614'
/
