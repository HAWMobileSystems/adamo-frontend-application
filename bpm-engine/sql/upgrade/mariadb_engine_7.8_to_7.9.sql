-- CAM-8442

ALTER TABLE ACT_ID_USER
  ADD LOCK_EXP_TIME_ timestamp(3) NULL;

ALTER TABLE ACT_ID_USER
  ADD ATTEMPTS_ integer;