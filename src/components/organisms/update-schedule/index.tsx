import { AiOutlineEdit, AiOutlineSend } from "react-icons/ai";
import { Button } from "../../atoms/button/Button";
import { CustomModal } from "../../molecules/modal/Modal";
import { MultipleTime } from "../../molecules/mutiple-time/MultipleTime";
import { useEffect, useState } from "react";
import { Flex, InputNumber } from "antd";
import useScheduleService from "../../../services/useScheduleService";
import { useCurrentUser } from "../../../utils/getcurrentUser";

function UpdateScheduler() {
  const [open, setOpen] = useState(false);
  const [timeDuration, setTimeDuration] = useState<number>(30);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState();
  const user = useCurrentUser();
  const { checkSchedule, sendSchedule, getSchedule } = useScheduleService();

  const onFinish = async (values: any) => {
    const response = await sendSchedule(values, timeDuration);
    handleCancel();
    fetchData();
  };

  const hanldeOnValuesChange = async (changedValues: any, allValues: any) => {
    const response = await checkSchedule(allValues, timeDuration);
    setError(response);
  };
  const handleCancel = () => {
    setOpen(!open);
  };
  const handleChange = (value: any) => {
    setTimeDuration(value);
  };

  const fetchData = async () => {
    const response = await getSchedule(user?.id);
    console.log(response);
    setData(response);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const body = (
    <>
      <div>
        <h3 className="mb-1">
          <strong>Tổng thời gian của bạn trong kì : </strong>
          {error?.currentTotalHours ? error.currentTotalHours : "0h"}
        </h3>
      </div>
      <Flex gap={"20px"} align="center">
        <h4>Chọn thời gian muốn cắt giữa các slot</h4>
        <InputNumber
          size="large"
          min={30}
          max={60}
          step={30}
          defaultValue={30}
          onChange={handleChange}
          formatter={(value) => `${value}p`}
        />
      </Flex>

      <MultipleTime label="Thứ 2" warning={error?.messages?.Monday} />
      <MultipleTime label="Thứ 3" warning={error?.messages?.Tuesday} />
      <MultipleTime label="Thứ 4" warning={error?.messages?.Wednesday} />
      <MultipleTime label="Thứ 5" warning={error?.messages?.Thursday} />
      <MultipleTime label="Thứ 6" warning={error?.messages?.Friday} />
      <MultipleTime label="Thứ 7" warning={error?.messages?.Saturday} />
      <MultipleTime label="Chủ Nhật" warning={error?.messages?.Sunday} />
    </>
  );

  const footer = (
    <div className="flex justify-between ">
      <Button
        children="Hủy bỏ"
        styleClass="border border-black"
        size="sm"
        onClick={handleCancel}
      />
      <Button
        isDisabled={error == null || error?.error ? true : false}
        children={
          <div className="flex justify-center items-center">
            <p className="mr-2">Xác nhận</p> <AiOutlineSend size={18} />
          </div>
        }
        size="sm"
        styleClass="bg-gradient-to-r from-[#FF6001] to-[#F9A26E] text-white"
        type="submit"
      />
    </div>
  );

  return (
    <>
      <Button
        children={
          <div className="flex justify-center items-center">
            <p className="mr-2">Cập nhật lịch trống</p>
            <AiOutlineEdit size={20} />
          </div>
        }
        styleClass="bg-gradient-to-r from-[#151316] to-[#5A4F5F] text-white"
        onClick={handleCancel}
        size="sm"
      />
      <CustomModal
        onValueChange={hanldeOnValuesChange}
        header="Cập nhật lịch trống trong tuần"
        body={body}
        footer={footer}
        isOpen={open}
        width={610}
        onCancel={handleCancel}
        onFinish={onFinish}
      />
    </>
  );
}

export default UpdateScheduler;
