---
title: mysqldump工具的基本使用和参数
date: 2016-11-06 15:19:16
keywords: "工具, mysqldump, 参数"
categories:
  - MYSQL
tags:
  - 杂项
  - 转载
  - 技术文档
  - 服务器搭建
  - 架构
---

一直采用GUI形式的SQL管理工具，直到昨天必须从Linux环境下把数据库迁移出去，才接触到mysqldump这个工具，发现比客户端好用，毕竟官方。



基本使用方法：



导出部分数据库：`mysqldump -uroot -pxxx dbname > filename.dump`



导出全部数据库：`mysqldump -uroot -pxxx –all-databases > filename.dump`



从文件恢复数据库：

>`mysql -uroot -pxxx`

>

> `source filename.dump`



基本使用这几个就够了，其他的使用`mysqldump --help`自己看吧，这里列举几个常用的参数:



**--all-databases  , -A**



导出全部数据库。



>mysqldump  -uroot -pxxx --all-databases



**--all-tablespaces  , -Y**



导出全部表空间（表空间参看这篇博客 [什么是MySQL表空间](/blog/what-is-mysql-tablespace) ）。



>mysqldump  -uroot -p --all-databases --all-tablespaces



**--no-tablespaces  , -y**



不导出任何表空间信息。



>mysqldump  -uroot -p --all-databases --no-tablespaces



**--add-drop-database**



每个数据库创建之前添加drop数据库语句。



>mysqldump  -uroot -p --all-databases --add-drop-database



**--add-drop-table**



每个数据表创建之前添加drop数据表语句。(默认为打开状态，使用--skip-add-drop-table取消选项)



>mysqldump  -uroot -p --all-databases  (默认添加drop语句)



>mysqldump  -uroot -p --all-databases –skip-add-drop-table  (取消drop语句)



**--add-locks**



在每个表导出之前增加LOCK TABLES并且之后UNLOCK  TABLE。(默认为打开状态，使用--skip-add-locks取消选项)



>mysqldump  -uroot -p --all-databases  (默认添加LOCK语句)



>mysqldump  -uroot -p --all-databases –skip-add-locks   (取消LOCK语句)



**--allow-keywords**



允许创建是关键词的列名字。这由表名前缀于每个列名做到。



>mysqldump  -uroot -p --all-databases --allow-keywords



**--apply-slave-statements**



在'CHANGE MASTER'前添加'STOP SLAVE'，并且在导出的最后添加'START SLAVE'。



>mysqldump  -uroot -p --all-databases --apply-slave-statements



**--character-sets-dir**



字符集文件的目录



>mysqldump  -uroot -p --all-databases  --character-sets-dir=/usr/local/mysql/share/mysql/charsets



**--comments**



附加注释信息。默认为打开，可以用--skip-comments取消



>mysqldump  -uroot -p --all-databases  (默认记录注释)



>mysqldump  -uroot -p --all-databases --skip-comments   (取消注释)



**--compatible**



导出的数据将和其它数据库或旧版本的MySQL 相兼容。值可以为`ansi、mysql323、mysql40、postgresql、oracle、mssql、db2、maxdb、no_key_options、no_tables_options、no_field_options`等，



要使用几个值，用逗号将它们隔开。它并不保证能完全兼容，而是尽量兼容。



>mysqldump  -uroot -p --all-databases --compatible=ansi



**--compact**



导出更少的输出信息(用于调试)。去掉注释和头尾等结构。可以使用选项：--skip-add-drop-table  --skip-add-locks --skip-comments --skip-disable-keys



>mysqldump  -uroot -p --all-databases --compact



**--complete-insert,  -c**



使用完整的insert语句(包含列名称)。这么做能提高插入效率，但是可能会受到max_allowed_packet参数的影响而导致插入失败。



>mysqldump  -uroot -p --all-databases --complete-insert



**--compress, -C**



在客户端和服务器之间启用压缩传递所有信息



>mysqldump  -uroot -p --all-databases --compress



**--create-options,  -a**



在CREATE TABLE语句中包括所有MySQL特性选项。(默认为打开状态)



>mysqldump  -uroot -p --all-databases



**--databases,  -B**



导出几个数据库。参数后面所有名字参量都被看作数据库名。



>mysqldump  -uroot -p --databases test mysql



**--debug**



输出debug信息，用于调试。默认值为：`/tmp/mysqldump.trace`



>mysqldump  -uroot -p --all-databases --debug



>mysqldump  -uroot -p --all-databases --debug=” d:t:o,/tmp/debug.trace”



**--debug-check**



检查内存和打开文件使用说明并退出。



>mysqldump  -uroot -p --all-databases --debug-check



**--debug-info**



输出调试信息并退出



>mysqldump  -uroot -p --all-databases --debug-info



**--default-character-set**



设置默认字符集，默认值为utf8



>mysqldump  -uroot -p --all-databases --default-character-set=latin1



**--delayed-insert**



采用延时插入方式（INSERT DELAYED）导出数据



>mysqldump  -uroot -p --all-databases --delayed-insert



**--delete-master-logs**



master备份后删除日志. 这个参数将自动激活--master-data。



>mysqldump  -uroot -p --all-databases --delete-master-logs



**--disable-keys**



对于每个表，用`/*!40000 ALTER TABLE tbl_name DISABLE KEYS */`;和`/*!40000 ALTER TABLE tbl_name ENABLE KEYS */`;语句引用INSERT语句。这样可以更快地导入dump出来的文件，因为它是在插入所有行后创建索引的。该选项只适合MyISAM表，默认为打开状态。



>mysqldump  -uroot -p --all-databases



**--dump-slave**



该选项将导致主的binlog位置和文件名追加到导出数据的文件中。设置为1时，将会以CHANGE MASTER命令输出到数据文件；设置为2时，在命令前增加说明信息。该选项将会打开--lock-all-tables，除非--single-transaction被指定。该选项会自动关闭--lock-tables选项。默认值为0。



>mysqldump  -uroot -p --all-databases --dump-slave=1



>mysqldump  -uroot -p --all-databases --dump-slave=2



**--events, -E**



导出事件。



>mysqldump  -uroot -p --all-databases --events



**--extended-insert,  -e**



使用具有多个VALUES列的INSERT语法。这样使导出文件更小，并加速导入时的速度。默认为打开状态，使用--skip-extended-insert取消选项。



>mysqldump  -uroot -p --all-databases



>mysqldump  -uroot -p --all-databases--skip-extended-insert   (取消选项)



**--fields-terminated-by**



导出文件中忽略给定字段。与--tab选项一起使用，不能用于--databases和--all-databases选项



>mysqldump  -uroot -p test test --tab=”/home/mysql” --fields-terminated-by=”#”



**--fields-enclosed-by**



输出文件中的各个字段用给定字符包裹。与--tab选项一起使用，不能用于--databases和--all-databases选项



>mysqldump  -uroot -p test test --tab=”/home/mysql” --fields-enclosed-by=”#”



**--fields-optionally-enclosed-by**



输出文件中的各个字段用给定字符选择性包裹。与--tab选项一起使用，不能用于--databases和--all-databases选项



>mysqldump  -uroot -p test test --tab=”/home/mysql”  --fields-enclosed-by=”#” --fields-optionally-enclosed-by  =”#”



**--fields-escaped-by**



输出文件中的各个字段忽略给定字符。与--tab选项一起使用，不能用于--databases和--all-databases选项



>mysqldump  -uroot -p mysql user --tab=”/home/mysql” --fields-escaped-by=”#”



**--flush-logs**



开始导出之前刷新日志。



请注意：假如一次导出多个数据库(使用选项--databases或者--all-databases)，将会逐个数据库刷新日志。除使用--lock-all-tables或者--master-data外。在这种情况下，日志将会被刷新一次，相应的所以表同时被锁定。因此，如果打算同时导出和刷新日志应该使用--lock-all-tables 或者--master-data 和--flush-logs。



>mysqldump  -uroot -p --all-databases --flush-logs



**--flush-privileges**



在导出mysql数据库之后，发出一条FLUSH  PRIVILEGES 语句。为了正确恢复，该选项应该用于导出mysql数据库和依赖mysql数据库数据的任何时候。



>mysqldump  -uroot -p --all-databases --flush-privileges



**--force**



在导出过程中忽略出现的SQL错误。



>mysqldump  -uroot -p --all-databases --force



**--help**



显示帮助信息并退出。



>mysqldump  --help



**--hex-blob**



使用十六进制格式导出二进制字符串字段。如果有二进制数据就必须使用该选项。影响到的字段类型有BINARY、VARBINARY、BLOB。



>mysqldump  -uroot -p --all-databases --hex-blob



**--host, -h**



需要导出的主机信息



>mysqldump  -uroot -p --host=localhost --all-databases



**--ignore-table**



不导出指定表。指定忽略多个表时，需要重复多次，每次一个表。每个表必须同时指定数据库和表名。例如：--ignore-table=database.table1 --ignore-table=database.table2 ……



>mysqldump  -uroot -p --host=localhost --all-databases --ignore-table=mysql.user



**--include-master-host-port**



在--dump-slave产生的'CHANGE  MASTER TO..'语句中增加'MASTER_HOST=<host>，MASTER_PORT=<port>'  



>mysqldump  -uroot -p --host=localhost --all-databases --include-master-host-port



**--insert-ignore**



在插入行时使用INSERT IGNORE语句.



>mysqldump  -uroot -p --host=localhost --all-databases --insert-ignore



**--lines-terminated-by**



输出文件的每行用给定字符串划分。与--tab选项一起使用，不能用于--databases和--all-databases选项。



>mysqldump  -uroot -p --host=localhost test test --tab=”/tmp/mysql”  --lines-terminated-by=”##”



**--lock-all-tables,  -x**



提交请求锁定所有数据库中的所有表，以保证数据的一致性。这是一个全局读锁，并且自动关闭--single-transaction 和--lock-tables 选项。



>mysqldump  -uroot -p --host=localhost --all-databases --lock-all-tables



**--lock-tables,  -l**



开始导出前，锁定所有表。用READ  LOCAL锁定表以允许MyISAM表并行插入。对于支持事务的表例如InnoDB和BDB，--single-transaction是一个更好的选择，因为它根本不需要锁定表。



请注意当导出多个数据库时，--lock-tables分别为每个数据库锁定表。因此，该选项不能保证导出文件中的表在数据库之间的逻辑一致性。不同数据库表的导出状态可以完全不同。



>mysqldump  -uroot -p --host=localhost --all-databases --lock-tables



**--log-error**



附加警告和错误信息到给定文件



>mysqldump  -uroot -p --host=localhost --all-databases  --log-error=/tmp/mysqldump_error_log.err



**--master-data**



该选项将binlog的位置和文件名追加到输出文件中。如果为1，将会输出CHANGE MASTER 命令；如果为2，输出的CHANGE  MASTER命令前添加注释信息。该选项将打开--lock-all-tables 选项，除非--single-transaction也被指定（在这种情况下，全局读锁在开始导出时获得很短的时间；其他内容参考下面的--single-transaction选项）。该选项自动关闭--lock-tables选项。



>mysqldump  -uroot -p --host=localhost --all-databases --master-data=1;



>mysqldump  -uroot -p --host=localhost --all-databases --master-data=2;



**--max_allowed_packet**



服务器发送和接受的最大包长度。



>mysqldump  -uroot -p --host=localhost --all-databases --max_allowed_packet=10240



**--net_buffer_length**



TCP/IP和socket连接的缓存大小。



>mysqldump  -uroot -p --host=localhost --all-databases --net_buffer_length=1024



**--no-autocommit**



使用autocommit/commit 语句包裹表。



>mysqldump  -uroot -p --host=localhost --all-databases --no-autocommit



**--no-create-db,  -n**



只导出数据，而不添加CREATE DATABASE 语句。



>mysqldump  -uroot -p --host=localhost --all-databases --no-create-db



**--no-create-info,  -t**



只导出数据，而不添加CREATE TABLE 语句。



>mysqldump  -uroot -p --host=localhost --all-databases --no-create-info



**--no-data, -d**



不导出任何数据，只导出数据库表结构。



>mysqldump  -uroot -p --host=localhost --all-databases --no-data



**--no-set-names,  -N**



等同于--skip-set-charset



>mysqldump  -uroot -p --host=localhost --all-databases --no-set-names



**--opt**



等同于--add-drop-table,  --add-locks, --create-options, --quick, --extended-insert, --lock-tables,  --set-charset, --disable-keys 该选项默认开启,  可以用--skip-opt禁用.



>mysqldump  -uroot -p --host=localhost --all-databases --opt



**--order-by-primary**



如果存在主键，或者第一个唯一键，对每个表的记录进行排序。在导出MyISAM表到InnoDB表时有效，但会使得导出工作花费很长时间。



>mysqldump  -uroot -p --host=localhost --all-databases --order-by-primary

