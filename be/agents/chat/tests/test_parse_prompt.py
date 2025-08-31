import pytest, uuid, unittest

from datetime import datetime, timedelta
from agents.chat.application.chatbot import reply, InputConfig


class TestParsePrompt(unittest.IsolatedAsyncioTestCase):
    currency = ["VND", "USD", "EUR"]

    # <editor-fold> desc="Trường hợp địa điểm chung chung và ngân sách trong khoảng"

    # Kỳ vọng:
    # "destination" = ""
    # "from_date": "2024-04-30",
    # "to_date": "2024-05-02"
    # "value": >= 10.000.000 và <= 20.000.000
    # faq_response có nội dung
    @pytest.mark.asyncio
    async def test_parse_prompt_general_location_budget_specific_dates(self):
        prompt = """
        Tôi muốn tạo kế hoạch cho chuyến du lịch 3 ngày 2 đêm cho nhóm gồm 10
        người. Chúng tôi dự định sẽ đi vào dịp lễ 30/4-1/5, với mục tiêu là
        được tận hưởng không khí trong lành của miền quê vùng núi Bắc Bộ. Dự
        chi mỗi người rơi vào khoảng từ 1 triệu đồng rưỡi đến 2 triệu đồng một người.
        Hãy giúp tôi lên kế hoạch một cách đầy đủ, chi tiết, đáp ứng nhu cầu, và
        đảm bảo có một trải nghiệm tốt nhất
        """
        result = await reply(prompt, self._get_input_cfg())

        destination = result["data"]["travel_input"]["destination"]
        time_interval = result["data"]["travel_input"]["time_interval"]
        budget = result["data"]["travel_input"]["budget"]
        faq_response = result["data"]["travel_input"]["faq_response"]

        # Địa điểm chung chung "vùng quê miền núi Bắc Bộ", không rõ ràng nên kỳ vọng không có dữ liệu
        assert destination == ""

        assert time_interval["from_date"] != ""
        assert time_interval["to_date"] != ""
        assert "04-30" in time_interval["from_date"]
        assert "05-02" in time_interval["to_date"]

        assert budget and "value" in budget and "currency" in budget
        assert budget["value"]
        assert 15000000 <= budget["value"] <= 20000000

        assert budget["currency"] != ""
        assert budget["currency"] == self.currency[0]

        assert faq_response != ""

    # Kỳ vọng:
    # "destination" = ""
    # "from_date": ngày thứ 7 tiếp theo so với ngày chạy test
    # "to_date": ngày chủ nhật tiếp theo so với ngày chạy test
    # "value": >= 2.000.000 và <= 2.500.000
    # faq_response có nội dung
    @pytest.mark.asyncio
    async def test_parse_prompt_general_location_budget_weekend_trip(self):
        prompt = """
        Tôi muốn đi du lịch một mình vào dịp cuối tuần này bằng xe máy.
        Tuy nhiên tôi vẫn chưa biết mình sẽ đi đâu cả.
        Ngân sách của tôi có khoảng 2 triệu đến 2 triệu rưỡi VND đồng và tôi muốn đến bãi biển nào đó
        gần Thái Bình nhất có thể để tiện đi lại.
        Hãy gợi ý và lên kế hoạch cho tôi về một bãi biển đẹp và có nhiều nhà hàng
        hải sản.
        """
        now = datetime.now()
        weekend = self._get_next_weekend(now)
        next_saturday = weekend[0].strftime("%Y-%m-%d")
        next_sunday = weekend[1].strftime("%Y-%m-%d")

        result = await reply(prompt, self._get_input_cfg())

        destination = result["data"]["travel_input"]["destination"]
        time_interval = result["data"]["travel_input"]["time_interval"]
        budget = result["data"]["travel_input"]["budget"]
        faq_response = result["data"]["travel_input"]["faq_response"]

        assert destination != ""

        assert time_interval["from_date"] != ""
        assert time_interval["to_date"] != ""
        assert time_interval["from_date"] == next_saturday
        assert time_interval["to_date"] == next_sunday

        assert budget and "value" in budget and "currency" in budget
        assert budget["value"]
        assert 2000000 < budget["value"] < 2500000

        assert budget["currency"] != ""
        assert budget["currency"] == self.currency[0]

        assert faq_response != ""

    # </editor-fold>

    # <editor-fold> desc="Trường hợp địa điểm rõ ràng và ngân sách rõ ràng"

    # Kỳ vọng:
    # "destination" = Bãi biển Thịnh Long
    # "from_date": ngày thứ 7 tiếp theo so với ngày chạy test
    # "to_date": ngày chủ nhật tiếp theo so với ngày chạy test
    # "value": 2.000.000
    # faq_response có nội dung
    @pytest.mark.asyncio
    async def test_parse_prompt_specific_location_budget_weekend_trip(self):
        prompt = """
        Tôi muốn đi du lịch một mình vào dịp cuối tuần này bằng xe máy.
        Tuy nhiên tôi vẫn chưa biết mình sẽ đi đâu cả.
        Ngân sách của tôi có 2 triệu đồng và tôi muốn đến bãi biển Thịnh Long để tiện đi lại.
        Hãy gợi ý và lên kế hoạch cho tôi về một bãi biển đẹp và có nhiều nhà hàng
        hải sản
        """
        now = datetime.now()
        weekend = self._get_next_weekend(now)
        next_saturday = weekend[0].strftime("%Y-%m-%d")
        next_sunday = weekend[1].strftime("%Y-%m-%d")

        result = await reply(prompt, self._get_input_cfg())

        destination = result["data"]["travel_input"]["destination"]
        time_interval = result["data"]["travel_input"]["time_interval"]
        budget = result["data"]["travel_input"]["budget"]
        faq_response = result["data"]["travel_input"]["faq_response"]

        assert destination != ""
        assert "thịnh long" in destination.lower()

        assert time_interval["from_date"] != ""
        assert time_interval["to_date"] != ""
        assert time_interval["from_date"] == next_saturday
        assert time_interval["to_date"] == next_sunday

        assert budget and "value" in budget and "currency" in budget
        assert budget["value"] == 2000000

        assert budget["currency"] != ""
        assert budget["currency"] == self.currency[0]

        assert faq_response != ""

    # Kỳ vọng:
    # "destination" = Đà Nẵng
    # "from_date": chứa ngày, tháng tương ứng 10/9
    # "to_date": chứa ngày, tháng tương ứng 13/9
    # "value": 3.000.000
    # faq_response có nội dung
    @pytest.mark.asyncio
    async def test_parse_prompt_specific_location_budget_dates(self):
        prompt = """
        Tôi muốn đặt phòng khách sạn tại Đà Nẵng cho 2 người
        Chúng tôi sẽ đi từ ngày 10/9 đến 13/9.
        Hãy giúp tôi lên kế hoạch cho chuyến du lịch trên
        với ngân sách 3 triệu. Ngoài ra giúp tôi tìm những
        khách sạn ở gần biển
        """
        result = await reply(prompt, self._get_input_cfg())

        destination = result["data"]["travel_input"]["destination"]
        time_interval = result["data"]["travel_input"]["time_interval"]
        budget = result["data"]["travel_input"]["budget"]
        faq_response = result["data"]["travel_input"]["faq_response"]

        assert destination != ""
        assert "đà nẵng" in destination.lower()

        assert time_interval["from_date"] != ""
        assert time_interval["to_date"] != ""
        assert "09-10" in time_interval["from_date"]
        assert "09-13" in time_interval["to_date"]

        assert budget and "value" in budget and "currency" in budget
        assert budget["value"] == 3000000

        assert budget["currency"] != ""
        assert budget["currency"] == self.currency[0]

        assert faq_response != ""

    # Kỳ vọng:
    # "destination" = Sa Pa
    # "from_date": chứa ngày, tháng tương ứng 1/1
    # "to_date": chứa ngày, tháng tương ứng 3/1
    # "value": 16.000.000
    # faq_response có nội dung
    @pytest.mark.asyncio
    async def test_parse_prompt_specific_location_budget_new_year_trip(self):
        prompt = """
        Tôi muốn tổ chức chuyến du lịch 3 ngày 2 đêm ở Sa Pa
        vào dịp Tết Dương lịch
        Nhóm chúng tôi có 8 người, dự định chi tiêu 2 triệu
        mỗi thành viên.
        Hãy giúp tôi lên kế hoạch và đặt phòng cho chuyến đi này
        """
        result = await reply(prompt, self._get_input_cfg())

        destination = result["data"]["travel_input"]["destination"]
        time_interval = result["data"]["travel_input"]["time_interval"]
        budget = result["data"]["travel_input"]["budget"]
        faq_response = result["data"]["travel_input"]["faq_response"]

        assert destination != ""
        assert "sa pa" in destination.lower()

        assert "01-01" in time_interval["from_date"]
        assert "01-03" in time_interval["to_date"]

        assert budget is not None
        assert budget["value"]
        assert budget["value"] == 16000000

        assert budget["currency"] != ""
        assert budget["currency"] == self.currency[0]

        assert faq_response != ""

    # </editor-fold>

    # <editor-fold> desc="Trường hợp thiếu 1 hoặc 1 vài mục"

    # Kỳ vọng:
    # "destination" = Phong Nha-Kẻ Bàng
    # "from_date": trống
    # "to_date": trống
    # "value": 0
    # faq_response có nội dung
    async def test_parse_prompt_specific_location_missing_dates_budget(self):
        prompt = """
        Tôi muốn lên kế hoạch du lịch Phong nha kẻ bàng.
        Hãy giúp tôi gợi ý kế hoạch du lịch phù hợp
        """

        result = await reply(prompt, self._get_input_cfg())

        destination = result["data"]["travel_input"]["destination"]
        time_interval = result["data"]["travel_input"]["time_interval"]
        budget = result["data"]["travel_input"]["budget"]
        faq_response = result["data"]["travel_input"]["faq_response"]

        assert destination != ""
        assert "phong nha" in destination.lower()
        assert "kẻ bàng" in destination.lower()

        assert time_interval["from_date"] == ""
        assert time_interval["to_date"] == ""

        assert budget and "value" in budget and "currency" in budget
        assert budget["value"] == 0

        assert budget["currency"] != ""
        assert budget["currency"] == self.currency[0]

        assert faq_response != ""

    # Kỳ vọng:
    # "destination" = trống
    # "from_date": trống
    # "to_date": trống
    # "value": 0
    # faq_response có nội dung
    async def test_parse_prompt_missing_dates_location_budget(self):
        prompt = """
        Tôi muốn đi du lịch và lúc rảnh. Hãy lên cho tôi 1 kế hoạch chi tiết
        """
        result = await reply(prompt, self._get_input_cfg())

        destination = result["data"]["travel_input"]["destination"]
        time_interval = result["data"]["travel_input"]["time_interval"]
        budget = result["data"]["travel_input"]["budget"]
        faq_response = result["data"]["travel_input"]["faq_response"]

        assert destination == ""

        assert time_interval["from_date"] == ""
        assert time_interval["to_date"] == ""

        assert budget and "value" in budget and "currency" in budget
        assert budget["value"] == 0

        assert budget["currency"] != ""
        assert budget["currency"] == self.currency[0]

        assert faq_response != ""

    # Kỳ vọng:
    # "destination" = Phú Quốc
    # "from_date": chứa ngày 10/1
    # "to_date": trống
    # "value": 0
    # faq_response có nội dung
    async def test_parse_prompt_missing_to_date_budget(self):
        prompt = """
        Gia đình 4 người chúng tôi muốn đi du lịch Phú Quốc vào ngày 10/1.
        Hãy giúp tôi lên kế hoạch chi tiết, đảm bảo chúng tôi có trải nghiệm tốt nhất
        """
        result = await reply(prompt, self._get_input_cfg())

        destination = result["data"]["travel_input"]["destination"]
        time_interval = result["data"]["travel_input"]["time_interval"]
        budget = result["data"]["travel_input"]["budget"]
        faq_response = result["data"]["travel_input"]["faq_response"]

        assert destination != ""
        assert "phú quốc" == destination.lower()

        assert time_interval["from_date"] != ""
        assert "01-10" in time_interval["from_date"]
        assert time_interval["to_date"] == ""

        assert budget and "value" in budget and "currency" in budget
        assert budget["value"] == 0

        assert budget["currency"] != ""
        assert budget["currency"] == self.currency[0]

        assert faq_response != ""

    # Kỳ vọng:
    # "destination" = Phú Quốc
    # "from_date": chứa ngày 10/1
    # "to_date": chứa ngày 13/1
    # "value": 0
    # faq_response có nội dung
    async def test_parse_prompt_missing_budget(self):
        prompt = """
        Gia đình 4 người chúng tôi muốn đi du lịch Phú Quốc 3 ngày 2 đêm từ ngày 10/1.
        Hãy giúp tôi lên kế hoạch chi tiết, đảm bảo chúng tôi có trải nghiệm tốt nhất
        """
        result = await reply(prompt, self._get_input_cfg())

        destination = result["data"]["travel_input"]["destination"]
        time_interval = result["data"]["travel_input"]["time_interval"]
        budget = result["data"]["travel_input"]["budget"]
        faq_response = result["data"]["travel_input"]["faq_response"]

        assert destination != ""
        assert "phú quốc" in destination.lower()

        assert time_interval["from_date"] != ""
        assert "01-10" in time_interval["from_date"]

        assert time_interval["to_date"] != ""
        assert "01-13" in time_interval["to_date"]

        assert budget and "value" in budget and "currency" in budget
        assert budget["value"] == 0

        assert budget["currency"] != ""
        assert budget["currency"] == self.currency[0]

        assert faq_response != ""

    # </editor-fold>

    @staticmethod
    def _get_next_weekend(today):
        if today is None:
            today = datetime.now().date()

        weekday = today.weekday()

        if weekday >= 5:
            days_until_saturday = (12 - weekday) % 7  # nhảy đến thứ 7 tuần tới
        else:
            days_until_saturday = 5 - weekday  # số ngày đến thứ 7 gần nhất

        next_saturday = today + timedelta(days=days_until_saturday)
        next_sunday = next_saturday + timedelta(days=1)

        return next_saturday, next_sunday

    @staticmethod
    def _get_input_cfg() -> InputConfig:
        return {
            "session_id": uuid.uuid1().__str__(),
            "user_id": "1"
        }


if __name__ == '__main__':
    unittest.main(warnings='ignore')
