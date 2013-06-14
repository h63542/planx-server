
USE `planx_graph`;
DELIMITER //

DROP TRIGGER IF EXISTS `tbl_serviceBill_AINS`//


CREATE TRIGGER `tbl_serviceBill_AINS` AFTER INSERT ON tbl_serviceBill FOR EACH ROW
-- Edit trigger body code below this line. Do not edit lines above this one
BEGIN
 UPDATE tbl_membercardFunds
 SET currentMoney =  currentMoney - NEW.money, currentScore =  currentScore + NEW.score
 WHERE enterpriseId = NEW.enterpriseId AND memberCardId = NEW.memberCardId;

END;
//

DROP TRIGGER IF EXISTS `tbl_serviceBill_ADEL`//


CREATE TRIGGER `tbl_serviceBill_ADEL` AFTER INSERT ON tbl_serviceBill FOR EACH ROW
-- Edit trigger body code below this line. Do not edit lines above this one
BEGIN
 UPDATE tbl_membercardFunds
 SET currentMoney =  currentMoney + NEW.money, currentScore =  currentScore - NEW.score
 WHERE enterpriseId = NEW.enterpriseId AND memberCardId = NEW.memberCardId;

END;
//

DROP TRIGGER IF EXISTS `tbl_serviceBill_AUPD`//


CREATE TRIGGER `tbl_serviceBill_AUPD` AFTER INSERT ON tbl_serviceBill FOR EACH ROW
-- Edit trigger body code below this line. Do not edit lines above this one
BEGIN
 UPDATE tbl_membercardFunds
 SET currentMoney =  currentMoney + OLD.money - NEW.money, currentScore =  currentScore - OLD.score + NEW.score
 WHERE enterpriseId = NEW.enterpriseId AND memberCardId = NEW.memberCardId;

END;
//



DROP TRIGGER IF EXISTS `tbl_memeberCardMgrRecords_AINS`//

CREATE TRIGGER `tbl_memeberCardMgrRecords_AINS` AFTER INSERT ON tbl_memeberCardMgrRecords FOR EACH ROW
-- Edit trigger body code below this line. Do not edit lines above this one
BEGIN
	CASE NEW.operType
-- 创建或充值
	WHEN 1 OR 2  THEN
	 UPDATE tbl_membercardFunds
	 SET currentMoney =  currentMoney - NEW.money, currentScore =  currentScore + NEW.score
	 WHERE enterpriseId = NEW.enterpriseId AND memberCardId = NEW.memberCardId;
	-- 挂失
	WHEN  3  THEN
	 UPDATE tbl_membercardFunds tbl_membercardFunds
	 SET status =  3
	 WHERE enterpriseId = NEW.enterpriseId AND memberCardId = NEW.memberCardId;
	-- 注销
	WHEN 4 THEN
	 UPDATE tbl_membercardFunds
	 SET status =  2, currentMoney =  currentMoney - NEW.money, currentScore =  currentScore - NEW.score
	 WHERE enterpriseId = NEW.enterpriseId AND memberCardId = NEW.memberCardId;
	-- 迁移
	WHEN  5  THEN
	 UPDATE tbl_membercardFunds
	 SET  currentMoney =  currentMoney + NEW.money, currentScore =  currentScore + NEW.score
	 WHERE enterpriseId = NEW.enterpriseId AND memberCardId = NEW.memberCardId;

	 UPDATE tbl_membercardFunds
	 SET status =  2, currentMoney =  currentMoney - NEW.money, currentScore =  currentScore - NEW.score
	 WHERE enterpriseId = NEW.enterpriseId AND memberCardId = NEW.transferMemberCardId;
	ELSE
	  INSERT INTO tbl_triggerErr(triggerName, executeSQLContent, errorInfo) VALUES('tbl_memeberCardMgrRecords_trigger',
	  NEW, ('opertype =' + NEW.operType + ' is  error'));
	END CASE;
END;

//


DROP TRIGGER IF EXISTS `tbl_memeberCardMgrRecords_ADEL`//
CREATE TRIGGER `tbl_memeberCardMgrRecords_ADEL` AFTER DELETE ON tbl_serviceBill FOR EACH ROW
-- Edit trigger body code below this line. Do not edit lines above this one
BEGIN
	CASE NEW.operType
-- 创建或充值
	WHEN 1 OR 2  THEN
	 UPDATE tbl_membercardFunds
	 SET currentMoney =  currentMoney + OLD.money, currentScore =  currentScore - OLD.score
	 WHERE enterpriseId = OLD.enterpriseId AND memberCardId = OLD.memberCardId;
	-- 挂失
	WHEN  3  THEN
	 UPDATE tbl_membercardFunds tbl_membercardFunds
	 SET status =  1
	 WHERE enterpriseId = OLD.enterpriseId AND memberCardId = OLD.memberCardId;
	-- 注销
	WHEN 4 THEN
	 UPDATE tbl_membercardFunds
	 SET status =  2, currentMoney =  currentMoney + NEW.money, currentScore =  currentScore + NEW.score
	 WHERE enterpriseId = OLD.enterpriseId AND memberCardId = OLD.memberCardId;
	-- 迁移
	WHEN  5  THEN
	 UPDATE tbl_membercardFunds
	 SET  currentMoney =  currentMoney - OLD.money, currentScore =  currentScore - OLD.score
	 WHERE enterpriseId = NEW.enterpriseId AND memberCardId = NEW.memberCardId;

	 UPDATE tbl_membercardFunds
	 SET status =  operType, currentMoney =  currentMoney + NEW.money, currentScore =  currentScore + NEW.score
	 WHERE enterpriseId = NEW.enterpriseId AND memberCardId = NEW.transferMemberCardId;
	ELSE
	  INSERT INTO tbl_triggerErr(triggerName, executeSQLContent, errorInfo) VALUES('tbl_memeberCardMgrRecords_trigger',
	  NEW, ('opertype =' + NEW.operType + ' is  error'));
	END CASE;
END;
//

DROP TRIGGER IF EXISTS `tbl_memeberCardMgrRecords_AUPD`//
CREATE TRIGGER `tbl_memeberCardMgrRecords_AUPD` AFTER UPDATE ON tbl_serviceBill FOR EACH ROW
-- Edit trigger body code below this line. Do not edit lines above this one
BEGIN
	CASE NEW.operType
-- 创建或充值
	WHEN 1 OR 2  THEN
	 UPDATE tbl_membercardFunds
	 SET currentMoney =  currentMoney - OLD.money + NEW.money, currentScore =  currentScore + OLD.score - NEW.score
	 WHERE enterpriseId = OLD.enterpriseId AND memberCardId = OLD.memberCardId;
	-- 挂失
	WHEN  3  THEN
	 UPDATE tbl_membercardFunds tbl_membercardFunds
	 SET status =  3
	 WHERE enterpriseId = OLD.enterpriseId AND memberCardId = OLD.memberCardId;
	-- 注销
	WHEN 4 THEN
	 UPDATE tbl_membercardFunds
	 SET status =  2, currentMoney =  currentMoney + OLD.money - NEW.money, currentScore =  currentScore + OLD.money - NEW.score
	 WHERE enterpriseId = OLD.enterpriseId AND memberCardId = OLD.memberCardId;
	-- 迁移
	WHEN  5  THEN
	 UPDATE tbl_membercardFunds
	 SET  currentMoney =  currentMoney - OLD.money + NEW.money, currentScore =  currentScore + OLD.score  - NEW.score
	 WHERE enterpriseId = NEW.enterpriseId AND memberCardId = NEW.memberCardId;

	 UPDATE tbl_membercardFunds
	 SET status =  operType, currentMoney =  currentMoney  + OLD.money- NEW.money, currentScore =  currentScore + OLD.money- NEW.score
	 WHERE enterpriseId = NEW.enterpriseId AND memberCardId = NEW.transferMemberCardId;
	ELSE
	  INSERT INTO tbl_triggerErr(triggerName, executeSQLContent, errorInfo) VALUES('tbl_memeberCardMgrRecords_trigger',
	  NEW, ('opertype =' + NEW.operType + ' is  error'));
	END CASE;
END;



