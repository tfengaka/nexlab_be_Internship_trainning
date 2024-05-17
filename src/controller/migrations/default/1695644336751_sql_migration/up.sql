-- Trigger: before_insert_otp
CREATE OR REPLACE FUNCTION before_insert_otp() RETURNS TRIGGER as $$ BEGIN NEW.expired_at := NOW() + INTERVAL '5 minutes';
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER before_insert_otp BEFORE
INSERT ON otp_logs FOR EACH ROW EXECUTE FUNCTION before_insert_otp();