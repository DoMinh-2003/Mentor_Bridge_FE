import { useCallback, useEffect, useState, useMemo } from "react";
import CustomizedCard from "../../molecules/card/Card";
import { Button } from "../../atoms/button/Button";
import { PieChart } from "../../molecules/chart/pie-chart/PieChart";
import { EyeOutlined } from "@ant-design/icons";
import AddTopicForm from "../../molecules/formTopic";
import useTopicService from "../../../services/useTopicService";
import TopicList from "../../molecules/topic-section";
import { Topic } from "../../../model/topic";
import { formatDateToDDMMYY } from "../../../utils/dateFormat";
import { Empty, Select } from "antd";
import { debounce } from "lodash";
import useBookingService from "../../../services/useBookingService";
import CountdownTimer from "../../layouts/countdown-timer";
import MeetingDetail from "../../organisms/meeting-detail";
import GroupList from "../../molecules/team-section";
import useMentorService from "../../../services/useMentorService";
import { HiDotsHorizontal } from "react-icons/hi";
import ContentsSection from "../../atoms/contents-section/ContentsSection";
import TopicDetail from "../../organisms/topic-detail";
import { convertStatus } from "../../../utils/convertStatus";

const HomeTemplate = () => {
  const [loading, setLoading] = useState(false);
  const [goodRate, setGoodRate] = useState(80);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [topic, setTopic] = useState<Topic[] | undefined>();
  const { getTopics } = useTopicService();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isOpenMeetingDetail, setIsOpenDetail] = useState(false);
  const { getBookingNearest } = useBookingService();
  const [bookingNearset, setBookingNearset] = useState([]);
  const [open, setOpen] = useState<boolean>(false);
  const { getTeams } = useMentorService();
  const [teams, setTeams] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState<Topic>();

  const handleOpenModal = (e: any) => {
    setOpen(true);
    setSelectedTopic(e);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  const fetch = async () => {
    try {
      const response = await getBookingNearest();
      setBookingNearset(response);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(selectedTopic)

  const fetchTeams = async () => {
    try {
      const response = await getTeams();
      setTeams(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetch();
    fetchTeams();
  }, []);

  // Use debounce to delay the filter action and avoid multiple renders
  const handleFilterChange = useMemo(
    () =>
      debounce((value) => {
        setSelectedStatus(value);
      }, 300), // 300ms debounce delay
    []
  );

  const fetchTopics = useCallback(async () => {
    try {
      const topics = await getTopics({
        page: 1,
        size: 10,
        sortBy: "name",
        sortDirection: "asc",
        status: selectedStatus,
      });
      setTopic(topics);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  }, [getTopics, selectedStatus]);

  useEffect(() => {
    fetchTopics();
  }, [selectedStatus, fetchTopics]);

  return (
    <div className="pt-6 pb-10 h-full w-full flex gap-6">
      <div className="w-1/4 h-full gap-6 flex flex-col">
        <div className="h-1/3">
          <CustomizedCard
            loading={loading}
            background="url('/src/assets/blue-abstract.svg')"
            styleClass="border-none"
          >
            <div className="h-full flex flex-col justify-between">
              <div className="text-white gap-2 flex flex-col">
                {bookingNearset && bookingNearset?.length > 0 ? (
                  <>
                    <span className="text-xs-large">
                      Buổi hẹn tiếp theo sẽ bắt đầu vào:
                    </span>
                    <h3 className="text-xl-extra-bold">
                      <CountdownTimer
                        dateTo={bookingNearset[0]?.timeFrame?.timeFrameTo}
                        targetDate={bookingNearset[0]?.timeFrame?.timeFrameFrom}
                      />
                    </h3>
                  </>
                ) : (
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: "600",
                      color: "#fff",
                    }}
                  >
                    Chưa có cuộc hẹn nào sắp tới
                  </span>
                )}
              </div>
              {bookingNearset && bookingNearset?.length > 0 && (
                <div className="flex justify-end">
                  <Button
                    onClick={() => setIsOpenDetail(true)}
                    size="xs"
                    styleClass="bg-shade-900 text-white"
                    fontSize="xs"
                  >
                    Xem lịch ngay
                  </Button>
                  <MeetingDetail
                    onCancel={() => setIsOpenDetail(false)}
                    setIsOpenDetail={setIsOpenDetail}
                    isOpen={isOpenMeetingDetail}
                    date={formatDateToDDMMYY(
                      bookingNearset[0]?.timeFrame?.timeFrameFrom
                    )}
                    meetings={bookingNearset}
                  />
                </div>
              )}
            </div>
          </CustomizedCard>
        </div>
        <div className="h-2/3">
          <CustomizedCard
            loading={loading}
            styleClass="bg-gradient-to-b from-[#151316] to-[#4D4252] border-none"
          >
            <div className="h-full w-full">
              <div className="text-white flex justify-between items-center">
                <span className="text-xs-medium">
                  Tỉ lệ phản hồi tích cực từ sinh viên (%)
                </span>
                <Button
                  styleClass="bg-[#FFFFFF30] rounded-[12px] h-[43px] w-[43px] flex justify-center items-center"
                  status="none"
                >
                  <EyeOutlined />
                </Button>
              </div>
              <PieChart
                data={[
                  {
                    id: "bad",
                    label: "Phần còn lại",
                    value: 100 - goodRate,
                  },
                  {
                    id: "good",
                    label: "Phản hồi tốt",
                    value: goodRate,
                  },
                ]}
              />
            </div>
          </CustomizedCard>
        </div>
      </div>
      <div className="w-3/4 h-full gap-6 flex flex-col">
        <div className="h-[calc(50%-12px)]">
          <CustomizedCard
            loading={loading}
            styleClass="border border-shade-800 border-1"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm-medium">Danh sách đề tài</h3>
              <div className="flex gap-4">
                <Select
                  defaultValue=""
                  style={{ width: 120 }}
                  onChange={handleFilterChange}
                  options={[
                    { value: "", label: "Tất cả" },
                    { value: "PENDING", label: "Đang yêu cầu" },
                    { value: "ACCEPTED", label: "Đã chấp nhận" },
                    { value: "REJECTED", label: "Bị từ chối" },
                    { value: "ACTIVE", label: "Đang hoạt động" },
                    { value: "APPROVE", label: "Đã đồng ý" },
                  ]}
                />
                {/* <Button
                  size="xs"
                  styleClass="bg-gradient-to-r from-[#151316] to-[#4D4252] text-white"
                  fontSize="xs"
                  onClick={() => setIsModalVisible(true)}
                >
                  Thêm đề tài mới +
                </Button> */}
              </div>
              <AddTopicForm
                fetchData={fetchTopics}
                onClose={() => setIsModalVisible(false)}
                isOpen={isModalVisible}
              />
            </div>
            {/* <TopicList topics={topic} /> */}
            <ul className="space-y-4 overflow-y-scroll h-4/5">
              {topic?.length > 0 ? (
                topic?.map((topic, idx) => (
                  <ContentsSection
                    key={topic?.id} // Ensure unique keys for each list item
                    time={convertStatus(topic?.status)}
                    content={topic?.name}
                    prefix={
                      <div className="bg-white border w-8 h-8 justify-center flex items-center rounded-full">
                        {idx + 1}
                      </div>
                    }
                    suffix={
                      <HiDotsHorizontal
                        style={{ cursor: "pointer", marginRight: "20px" }}
                        size={22}
                        onClick={() => handleOpenModal(topic)}
                      />
                    }
                    styleClass=" bg-[#f9fafb]"
                  />
                ))
              ) : (
                <Empty description="Hiện chưa có đề tài nào" />
              )}
            </ul>
          </CustomizedCard>
          <TopicDetail
            isOpen={open}
            onCancel={handleCloseModal}
            topic={selectedTopic}
            isLeader={false}
            // load={load}
            // setLoad={setLoad}
          />
        </div>
        <div className="h-[calc(50%-12px)]">
          <CustomizedCard
            loading={loading}
            background="url('/src/assets/blue-green-abstract.svg')"
            styleClass="border-none"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm-medium">Danh sách nhóm</h3>
            </div>
            {/* <ul className="space-y-4 overflow-y-scroll h-4/5">
              {topic?.map((topic) => (
                <ContentsSection
                  key={topic.id}
                  time={formatDateToDDMMYY(topic.createdAt)}
                  content={topic.name}
                  status={
                    topic?.status?.toLowerCase() === "inactive"
                      ? "success"
                      : topic?.status?.toLowerCase()
                  }
                  value={convertStatus(topic?.status)}
                />
              ))}
            </ul> */}

            <GroupList groups={teams} />
          </CustomizedCard>
        </div>
      </div>
    </div>
  );
};

export default HomeTemplate;
