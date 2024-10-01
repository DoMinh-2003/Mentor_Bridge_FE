import { Col, Divider, Form, Image, Input, Row } from "antd";
import bg from "../../assets/truong-dai-hoc-fpt-ho-chi-minh.jpg";
import "./Login.scss";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { Button } from "../../components/atoms/button/Button";
import { LuArrowLeft, LuArrowRight } from "react-icons/lu";

function Login() {
  return (
    <Row className="overflow-y-hidden h-[100vh]">
      <Col md={9} className="flex justify-center items-center">
        <Row>
          <Col md={24}>
            <h1 className="text-2xl-bold pb-[72px]">Đăng nhập vào hệ thống</h1>
            <Button
              children={
                <div className="flex items-center justify-center">
                  <FcGoogle size={18} />{" "}
                  <p className="pl-1">Đăng nhập với Google</p>
                </div>
              }
              styleClass="w-[369px] h-[47px] bg-transparent border border-[#D5D5D7]"
              fontSize="xs"
            />

            <Divider className="login__divider">
              Hoặc đăng nhập bằng tên tài khoản
            </Divider>
            <Form layout="vertical">
              <Form.Item label="Tên tài khoản">
                <Input />
              </Form.Item>
              <Form.Item
                label={
                  <div className="flex justify-between w-full ">
                    <p className="text-xs-bold">Mật khẩu</p>
                    <Link to="/forgot" className="underline text-xs-light">
                      Quên mật khẩu?
                    </Link>
                  </div>
                }
                className="pb-[20px]"
              >
                <Input.Password />
              </Form.Item>
            </Form>
            <Button
              children="Đăng nhập"
              styleClass="w-[369px] h-[46px] text-shade-300 bg-transparent border border-[#D5D5D7] 
        bg-gradient-to-r from-[#FF6001] from-43.73%  to-[#F9A26E] to-99.08%"
              fontSize="xs"
            />
          </Col>
        </Row>
      </Col>
      <Col md={15} className="relative">
        <Image
          src={bg}
          preview={false}
          height={"100%"}
          className="brightness-125"
        />
        <div className="absolute bottom-[33px] left-[41px] w-[725px] h-[220px] bg-[#0000004D] rounded-2xl backdrop-blur-sm">
          <div className="py-[23px] px-[33px] text-shade-300">
            <h3 className="text-2xl-medium mb-[16px]">Giới thiệu</h3>
            <p className="text-xs-book">
              Mentor Bridge là một hệ thống sáng tạo do sinh viên trường đại học
              FPT phát triển, nhằm kết nối và tối ưu hóa trải nghiệm học tập
              giữa sinh viên và mentor. Hệ thống cung cấp các tính năng quản lý
              tài khoản, tạo và quản lý nhóm dự án, cũng như lên lịch gặp gỡ với
              các mentor có kỹ năng phù hợp.
            </p>
          </div>
          <div className="flex float-end pr-10 text-shade-300">
            <Button
              children={<LuArrowLeft className="w-[20px] h-[30px]" />}
              styleClass="flex items-center justify-center bg-transparent border border-[#D5D5D7]"
              size="xs"
            />
            <Button
              children={<LuArrowRight className="w-[20px] h-[30px]" />}
              styleClass="flex items-center justify-center bg-transparent border border-[#D5D5D7] ml-2"
              size="xs"
            />
          </div>
        </div>
        <h1 className="flex items-center justify-center"></h1>
      </Col>
    </Row>
  );
}

export default Login;
