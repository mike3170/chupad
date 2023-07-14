col sheet_no format a12;
col doc_no format a12;
col bar_code format a12;
col locate format a12;
set linesize 120;
select * from abs_bar_code_temp order by sheet_no;
