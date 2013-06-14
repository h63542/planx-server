USE `planx_graph`;
DELIMITER //

CREATE TABLE planx_graph.ticket_mutex (
    name varchar(32) NOT NULL PRIMARY KEY COMMENT '对象类型',
    value bigint(20) UNSIGNED NOT NULL COMMENT 'ID值'
)Engine=InnoDB DEFAULT CHARSET=UTF8 COMMENT '保存分表ID表';

CREATE TABLE planx_graph.record_router (
    id bigint(20) UNSIGNED NOT NULL PRIMARY KEY COMMENT 'ID值',
    tableName varchar(32) NOT NULL  COMMENT '路由表信息'
)Engine=InnoDB DEFAULT CHARSET=UTF8 COMMENT '保存每条记录对应的实际存储表信息';

INSERT INTO planx_graph.ticket_mutex(name, value) values('ENTITY', 0);




DROP TABLE IF EXISTS `tbl_membercardFunds`//


CREATE  TABLE  tbl_membercardFunds(
  `enterpriseId` BIGINT NOT NULL COMMENT '会员卡归属企业ID' ,
  `memberCardId` BIGINT NOT NULL COMMENT '填写会员卡标识' ,
  `cardCategory` BIGINT NULL COMMENT '会员卡类别，做冗余，便于后续按照会员卡类别进行分析统计' ,
  `currentMoney` FLOAT NULL COMMENT '当前可以使用的余额' ,
  `totalMoney` FLOAT NULL COMMENT '会员从开卡累积充值金额' ,
  `currentScore` INT NULL COMMENT '当前积分' ,
  `totalScore` INT NULL COMMENT '累积积分' ,
  `lastUsedDate` DATETIME NULL COMMENT '最近一次消费时间' ,
  `usedTotalNum` INT NULL COMMENT '总消费次数' ,
  `status` TINYINT NULL COMMENT '会员卡状态：\n1-normal     正常\n2-stopped   停用\n3-loss          挂失' ,
  `lastModifiedDate` TIMESTAMP NULL ,
  UNIQUE INDEX `enterpriseId_UNIQUE` (`enterpriseId` ASC) ,
  UNIQUE INDEX `memberCardId_UNIQUE` (`memberCardId` ASC) )

//

DROP TABLE IF EXISTS `tbl_billProductDetails`//

CREATE  TABLE  tbl_billProductDetails(
  `billNo` VARCHAR(64) NULL COMMENT '产品流水单号： 生成规则： YYYYMMDDhhmmss + 流水号， 由程序生成' ,
  `enterpriseId` BIGINT NULL COMMENT '会员卡归属企业ID' ,
  `productId` BIGINT NULL COMMENT '消费产品ID' ,
  `occurdate` DATETIME NULL COMMENT '消费发生事件' ,
  `productName` VARCHAR(64) NULL ,
  `unitPrice` FLOAT NULL ,
  `discount` FLOAT NULL COMMENT '根据不同会员卡折扣信息不同' ,
  `purchaseScore` INT NULL DEFAULT 0 COMMENT '购买商品所需积分，用于礼品' ,
  `purchaseNum` INT NULL ,
  `earnScore` INT NULL COMMENT '消费商品赠送积分' ,
  `totalMoney` FLOAT NULL COMMENT '该产品消费金额： price* num*discount' ,
  `comment` TEXT NULL ,
  `lastModifiedDate` TIMESTAMP NULL ,
  UNIQUE INDEX `billNo_UNIQUE` (`billNo` ASC) ,
  UNIQUE INDEX `productId_UNIQUE` (`productId` ASC) ,
  UNIQUE INDEX `enterpriseId_UNIQUE` (`enterpriseId` ASC) )

//

DROP TABLE IF EXISTS `tbl_serviceBill`//

CREATE  TABLE tbl_serviceBill(
  `billNo` VARCHAR(64) NOT NULL COMMENT '产品流水单号： 生成规则： YYYYMMDDhhmmss + 4位流水号， 由程序生成' ,
  `enterpriseId` BIGINT NULL COMMENT '会员卡归属企业ID' ,
  `billType` TINYINT NULL COMMENT '流水单类型：\n0-消费单\n1-积分兑换单' ,
  `occurdate` DATETIME NULL COMMENT '消费发生事件' ,
  `membercardId` BIGINT NULL COMMENT '填写会员卡标识， 如果是散户不用填写' ,
  `cardCategory` BIGINT NULL COMMENT '会员卡类别，做冗余，便于后续按照会员卡类别进行分析统计' ,
  `userType` TINYINT NULL COMMENT '0-散客， 1-会员' ,
  `money` FLOAT NULL COMMENT '本流水单支付金额' ,
  `score` INT NULL COMMENT '本次消费积分' ,
  `payDetail` VARCHAR(1024) NULL COMMENT '记录支付详细信息，用于细节查询\n\n{\n   \"prePaidCard\": 100,    ===存储卡支付，即会员卡\n   \"cash\": 100,           ===现金支付\n   \"coupon\": 100,         ====代金券支付\n   \"bankAccount\": {       ===银行卡支付\n      \"id\": 111,   ===银行账号ID\n      \"money\": 100\n   }\n}' ,
  `comment` TEXT NULL ,
  `status` TINYINT NULL COMMENT '0-申请，用户或前台创建申请\n1-已支付，客户已经支付\n2-已结算， 后台已经结算完成\n' ,
  `LastModifiedDate` TIMESTAMP NULL COMMENT '记录最后修改时间' ,
  UNIQUE INDEX `billNo_UNIQUE` (`billNo` ASC) ,
  UNIQUE INDEX `enterpriseId_UNIQUE` (`enterpriseId` ASC) )

//

DROP TABLE IF EXISTS `tbl_serviceBonusDetials`//

CREATE  TABLE  tbl_serviceBonusDetials(
  `billNo` VARCHAR(64) NULL COMMENT '产品流水单号： 生成规则： YYYYMMDDhhmmss + 流水号， 由程序生成' ,
  `enterpriseId` BIGINT NULL COMMENT '会员卡归属企业ID' ,
  `employeeId` BIGINT NULL ,
  `occurdate` DATETIME NULL COMMENT '消费发生事件' ,
  `employeeName` VARCHAR(45) NULL ,
  `employeeJobId` VARCHAR(45) NULL COMMENT '员工工号' ,
  `employeeJobName` VARCHAR(45) NULL ,
  `arrangeMode` TINYINT NULL COMMENT '1-appoint指定\n0-random非指定' ,
  `bonus` FLOAT NULL ,
  `satisfaction` TINYINT NULL COMMENT '5-很满意\n4-满意\n3-一般\n2-不满意\n1-很不满意' ,
  `comment` TEXT NULL ,
  `lastModifiedDate` TIMESTAMP NULL ,
  UNIQUE INDEX `billSeq_UNIQUE` (`billSeq` ASC) ,
  UNIQUE INDEX `enterpriseId_UNIQUE` (`enterpriseId` ASC) ,
  UNIQUE INDEX `employeeId_UNIQUE` (`employeeId` ASC) ,
  UNIQUE INDEX `billNo_UNIQUE` (`billNo` ASC) )

//

DROP TABLE IF EXISTS `tbl_memeberCardMgrRecords`//
CREATE  TABLE  tbl_memeberCardMgrRecords(
  `seq` BIGINT NOT NULL AUTO_INCREMENT ,
  `enterpriseId` BIGINT NULL COMMENT '会员卡归属企业ID' ,
  `membercardId` BIGINT NULL COMMENT '填写会员卡标识， 如果是散户不用填写' ,
  `occurDate` DATETIME NULL COMMENT '生成时间' ,
  `operType` TINYINT NULL COMMENT '会员管理操作：\n1-开卡\n2-充值\n3-挂失\n4-注销\n5-迁移' ,
  `transferMemberCardId` BIGINT NULL COMMENT '如果是迁移流程，则填写迁移的会员卡ID' ,
  `cardCategory` BIGINT NULL COMMENT '会员卡类别，做冗余，便于后续按照会员卡类别进行分析统计' ,
  `money` FLOAT NULL COMMENT '1、如果是开卡或充值流程，则填写开卡/充值金额\n2、如果是挂失流程，则填写为空\n3、如果是注销流程，则填写注销取值金额\n\n' ,
  `score` INT NULL COMMENT '本次消费积分' ,
  `payDetail` TEXT NULL COMMENT '记录支付详细信息，用于细节查询\n\n{\n   \"prePaidCard\": 100,    ===存储卡支付，即会员卡\n   \"cash\": 100,           ===现金支付\n   \"coupon\": 100,         ====代金券支付\n   \"bankAccount\": {       ===银行卡支付\n      \"id\": 111,   ===银行账号ID\n      \"money\": 100\n   }\n}' ,
  `comment` TEXT NULL ,
  `status` TINYINT NULL COMMENT '0-申请，用户或前台创建申请\n1-已支付，客户已经支付\n2-已结算， 后台已经结算完成\n' ,
  `LastModifiedDate` TIMESTAMP NULL COMMENT '记录最后修改时间' ,
  PRIMARY KEY (`seq`) )
//

DROP TABLE IF EXISTS `tbl_salaryRecords`//

CREATE  TABLE tbl_salaryRecords(
  `enterpriseId` BIGINT NOT NULL COMMENT '会员卡归属企业ID' ,
  `employeeId` BIGINT NOT NULL ,
  `beginDate` DATETIME NOT NULL ,
  `endDate` DATETIME NOT NULL ,
  `regularPay` FLOAT NOT NULL DEFAULT 0 COMMENT '基本工资' ,
  `rewardPay` FLOAT NOT NULL DEFAULT 0 COMMENT '奖励' ,
  `penalty` FLOAT NOT NULL DEFAULT 0 COMMENT '罚款' ,
  `bonusPay` FLOAT NOT NULL DEFAULT 0 COMMENT '提成工资' ,
  `salary` FLOAT NOT NULL COMMENT '实发工资=regularPay+rewardPay-penalty+bonusPay' ,
  `status` TINYINT NULL COMMENT '1-待发放PendingPay  \n2-已发放finished\"' ,
  `comment` TEXT NULL ,
  `LastModifiedDate` TIMESTAMP NULL COMMENT '记录最后修改时间' ,
  UNIQUE INDEX `enterpriseId_UNIQUE` (`enterpriseId` ASC) ,
  UNIQUE INDEX `employeeId_UNIQUE` (`employeeId` ASC) ,
  UNIQUE INDEX `beginDate_UNIQUE` (`beginDate` ASC) ,
  UNIQUE INDEX `endDate_UNIQUE` (`endDate` ASC) )
//


DROP TABLE IF EXISTS `tbl_RewardPenaltyRecords`//

CREATE  TABLE  tbl_RewardPenaltyRecords (
  `enterpriseId` BIGINT NOT NULL COMMENT '会员卡归属企业ID' ,
  `employeeId` BIGINT NOT NULL ,
  `occurrDate` DATE NOT NULL COMMENT '事件发生的时间' ,
  `eventType` VARCHAR(45) NULL COMMENT '1-奖励事件reward\n2-惩罚事件penalty\n' ,
  `event` TEXT NULL COMMENT '奖罚事件' ,
  `money` FLOAT NULL ,
  `details` TEXT NULL COMMENT '事件详细' ,
  `LastModifiedDate` TIMESTAMP NULL COMMENT '记录最后修改时间' )

//

DROP TABLE IF EXISTS `tbl_attendanceApplyRecords`//
CREATE  TABLE  tbl_attendanceApplyRecords(
  `enterpriseId` BIGINT NOT NULL COMMENT '会员卡归属企业ID' ,
  `employeeId` BIGINT NOT NULL ,
  `category` TINYINT NULL COMMENT '1-leave\n2-overtime' ,
  `reason` TEXT NULL COMMENT '请假/加班理由' ,
  `startTime` DATETIME NOT NULL COMMENT '事件发生的时间' ,
  `endTime` DATETIME NULL ,
  `leavingDuration` FLOAT NULL ,
  `overDuration` FLOAT NULL ,
  `comment` TEXT NULL ,
  `status` TINYINT NULL COMMENT '1-等待审批pending\n2-审批通过finished' ,
  `LastModifiedDate` TIMESTAMP NULL COMMENT '记录最后修改时间' )

//


DROP TABLE IF EXISTS `tbl_attendanceRecords`//
CREATE  TABLE  tbl_attendanceRecords(
  `enterpriseId` BIGINT NOT NULL COMMENT '会员卡归属企业ID' ,
  `employeeId` BIGINT NOT NULL ,
  `startTime` DATETIME NOT NULL COMMENT '事件发生的时间' ,
  `endTime` DATETIME NULL ,
  `lateDuration` FLOAT NULL ,
  `leavingDuration` FLOAT NULL ,
  `overDuration` FLOAT NULL ,
  `comment` TEXT NULL ,
  `LastModifiedDate` TIMESTAMP NULL COMMENT '记录最后修改时间' )

//

DROP TABLE IF EXISTS `tbl_revAndExpRecords`//
CREATE  TABLE  tbl_revAndExpRecords(
  `enterpriseId` BIGINT NOT NULL COMMENT '会员卡归属企业ID' ,
  `occurrDate` DATE NOT NULL COMMENT '事件发生的时间' ,
  `category` VARCHAR(125) NULL COMMENT '收支类别' ,
  `content` VARCHAR(45) NULL ,
  `bankAccountId` VARCHAR(45) NULL ,
  `bankName` VARCHAR(125) NULL ,
  `handleEmployeeId` BIGINT NULL COMMENT '办理员工ID' ,
  `handleEmployeeName` VARCHAR(125) NULL COMMENT '处理员工ID' ,
  `comment` TEXT NULL ,
  `LastModifiedDate` TIMESTAMP NULL COMMENT '记录最后修改时间' )

//

DROP TABLE IF EXISTS `tbl_bankAccounts`//
CREATE  TABLE  tbl_bankAccounts(
  `enterpriseId` BIGINT NOT NULL COMMENT '会员卡归属企业ID' ,
  `bankAccountId` VARCHAR(45) NULL ,
  `bankName` VARCHAR(125) NULL ,
  `bankAccountHolder` VARCHAR(125) NOT NULL ,
  `money` FLOAT NULL COMMENT '账户余额' ,
  `comment` TEXT NULL ,
  `lastModifiedDate` TIMESTAMP NULL COMMENT '记录最后修改时间' )

//


DROP TABLE IF EXISTS `tbl_DBBackDataHistoryLogs`//
CREATE  TABLE tbl_DBBackDataHistoryLogs (
  `sequence` INT NOT NULL ,
  `enterpriseId` BIGINT NOT NULL COMMENT '会员卡归属企业ID，设计这个考虑，为后面实现分区表预留' ,
  `tblName` VARCHAR(65) NULL ,
  `tblRecordLastModifiedDate` DATETIME NULL ,
  `tblIndexInfo` TINYINT NULL ,
  `lastModifiedDate` TIMESTAMP NULL COMMENT '记录最后修改时间' ,
  PRIMARY KEY (`sequence`) )
ENGINE = InnoDB

//


DROP TABLE IF EXISTS `tbl_triggerErr`//
CREATE TABLE `tbl_triggerErr` (
  `seq` int(11) NOT NULL AUTO_INCREMENT,
  `occurTime` timestamp NULL DEFAULT NULL,
  `triggerName` text COLLATE utf8_bin,
  `executeSQLContent` text COLLATE utf8_bin,
  `errorInfo` text COLLATE utf8_bin,
  PRIMARY KEY (`seq`)
)

//



