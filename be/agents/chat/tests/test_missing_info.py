import pytest, uuid, unittest
from agents.chat.application.chatbot import reply, InputConfig


class TestParsePrompt(unittest.IsolatedAsyncioTestCase):
    # <editor-fold> desc="Trường hợp địa điểm chung chung và ngân sách trong khoảng"

    # Kỳ vọng:
    # missing_fields có destination
    @pytest.mark.asyncio
    async def test_missing_destination(self):
        prompts = [
            """
            Tôi muốn tạo kế hoạch cho chuyến du lịch 3 ngày 2 đêm cho nhóm gồm 10
            người. Chúng tôi dự định sẽ đi vào dịp lễ 30/4-1/5, với mục tiêu là
            được tận hưởng không khí trong lành của miền quê vùng núi Bắc Bộ. Dự
            chi mỗi người rơi vào khoảng từ 1 triệu đồng rưỡi đến 2 triệu đồng một người.
            Hãy giúp tôi lên kế hoạch một cách đầy đủ, chi tiết, đáp ứng nhu cầu, và
            đảm bảo có một trải nghiệm tốt nhất
            """,

            """
            Nhóm bạn chúng tôi muốn có một chuyến đi nghỉ dưỡng vào dịp hè này.
            Chúng tôi dự định đi khoảng 5 ngày, từ 10/1 đến 15/1 với ngân sách
            mỗi người tầm 5 đến 7 triệu đồng. Chúng tôi dự định đến khu du lịch
            nào đó ở miền Trung, chỗ mà có không khí trong lành và nhiều hoạt động giải trí.
            """
        ]

        for prompt in prompts:
            result = await reply(prompt, self._get_input_cfg())

            missing_fields = result["data"]["travel_input"]["missing_fields"]

            assert "destination" in missing_fields
            assert "budget" not in missing_fields

    # Kỳ vọng:
    # missing_fields có destination, return date và start date
    @pytest.mark.asyncio
    async def test_missing_destination_from_date_to_date(self):
        prompts = [
            """
            Tôi muốn đi du lịch một mình vào dịp cuối tuần này bằng xe máy.
            Tuy nhiên tôi vẫn chưa biết mình sẽ đi đâu cả.
            Ngân sách của tôi có khoảng 2 triệu đến 2 triệu rưỡi VND đồng và tôi muốn đến bãi biển nào đó
            gần Thái Bình nhất có thể để tiện đi lại.
            Hãy gợi ý và lên kế hoạch cho tôi về một bãi biển đẹp và có nhiều nhà hàng
            hải sản.
            """,

            """
            Nhóm bạn chúng tôi muốn có một chuyến đi nghỉ dưỡng vào dịp hè này.
            Chúng tôi dự định đi khoảng 5 ngày, ngân sách mỗi người tầm 5 đến 7 triệu đồng.
            Chúng tôi dự định đến khu du lịch nào đó ở miền Trung, chỗ mà
            có không khí trong lành và nhiều hoạt động giải trí.
            """,

            """
            Tôi muốn tổ chức chuyến du lịch cho công ty vào dịp cuối năm.
            Khoảng 20 người, dự trù chi phí tầm 45 - 50 triệu cho cả đoàn.
            Chúng tôi muốn đi đâu đó vừa thuận tiện đi lại, vừa có không gian
            để tổ chức team building, nhưng hiện tại chưa chọn được địa điểm.
            """
        ]

        for prompt in prompts:
            result = await reply(prompt, self._get_input_cfg())

            missing_fields = result["data"]["travel_input"]["missing_fields"]

            assert "destination" in missing_fields
            assert "budget" not in missing_fields
            assert "return date" in missing_fields
            assert "start date" in missing_fields

    # Địa điểm: Đi đâu đó nhưng chưa chốt
    # Budget: Từ 45 đến 50tr cả đoàn
    # Kỳ vọng:
    # missing_fields có destination và return date
    @pytest.mark.asyncio
    async def test_missing_destination_to_date(self):
        prompt = """
        Tôi muốn tổ chức chuyến du lịch cho công ty vào dịp đầu năm.
        Khoảng 20 người, dự trù chi phí tầm 45 đến 50 triệu cho cả đoàn từ ngày 9/2.
        Chúng tôi muốn đi đâu đó vừa thuận tiện đi lại, vừa có không gian
        để tổ chức team building, nhưng hiện tại chưa chọn được địa điểm.
        """

        result = await reply(prompt, self._get_input_cfg())

        missing_fields = result["data"]["travel_input"]["missing_fields"]

        assert "destination" in missing_fields
        assert "budget" not in missing_fields
        assert "return date" in missing_fields

    # Địa điểm: Đi đâu đó nhưng chưa chốt
    # Budget: Từ 50 đến 60tr cả đoàn
    # Kỳ vọng:
    # missing_fields có destination và start date
    @pytest.mark.asyncio
    async def test_missing_destination_from_date(self):
        prompt = """
        Tôi muốn tổ chức chuyến du lịch cho công ty.
        Khoảng 20 người, dự trù chi phí tầm 50 triệu hoặc 60 triệu cho cả đoàn.
        Chúng tôi muốn đi đâu đó vừa thuận tiện đi lại, vừa có không gian
        để tổ chức team building, nhưng hiện tại chưa chọn được địa điểm.
        Chúng tôi phải về trước ngày 20/10 để kịp làm lễ nhà giáo cho con
        """

        result = await reply(prompt, self._get_input_cfg())

        missing_fields = result["data"]["travel_input"]["missing_fields"]

        assert "destination" in missing_fields
        assert "budget" not in missing_fields
        assert "start date" in missing_fields

    # </editor-fold>

    # <editor-fold> desc="Trường hợp thiếu 1 hoặc 1 vài mục"

    # Kỳ vọng:
    # missing_fields chứa start date, return date, budget
    async def test_missing_from_date_to_date_budget(self):
        prompt = """
        Tôi muốn lên kế hoạch du lịch Phong nha kẻ bàng.
        Hãy giúp tôi gợi ý kế hoạch du lịch phù hợp
        """

        result = await reply(prompt, self._get_input_cfg())

        missing_fields = result["data"]["travel_input"]["missing_fields"]

        assert missing_fields != []
        assert "start date" in missing_fields
        assert "return date" in missing_fields
        assert "budget" in missing_fields

    # Kỳ vọng:
    # missing_fields chứa start date, return date, budget, destination
    async def test_missing_from_date_to_date_budget_destination(self):
        prompt = """
        Tôi muốn đi du lịch và lúc rảnh. Hãy lên cho tôi 1 kế hoạch chi tiết
        """
        result = await reply(prompt, self._get_input_cfg())

        missing_fields = result["data"]["travel_input"]["missing_fields"]

        assert "start date" in missing_fields
        assert "return date" in missing_fields
        assert "budget" in missing_fields
        assert "destination" in missing_fields

    # Kỳ vọng:
    # missing_fields chứa return date, budget
    async def test_missing_to_date_budget(self):
        prompt = """
        Gia đình 4 người chúng tôi muốn đi du lịch Phú Quốc vào ngày 10/1.
        Hãy giúp tôi lên kế hoạch chi tiết, đảm bảo chúng tôi có trải nghiệm tốt nhất
        """
        result = await reply(prompt, self._get_input_cfg())

        missing_fields = result["data"]["travel_input"]["missing_fields"]

        assert "return date" in missing_fields
        assert "budget" in missing_fields

    # Kỳ vọng:
    # missing_fields chứa budget
    async def test_missing_budget(self):
        prompt = """
        Gia đình 4 người chúng tôi muốn đi du lịch Phú Quốc 3 ngày 2 đêm từ ngày 10/1.
        Hãy giúp tôi lên kế hoạch chi tiết, đảm bảo chúng tôi có trải nghiệm tốt nhất
        """
        result = await reply(prompt, self._get_input_cfg())

        missing_fields = result["data"]["travel_input"]["missing_fields"]

        assert missing_fields != []
        assert "budget" in missing_fields

    # </editor-fold>

    @staticmethod
    def _get_input_cfg() -> InputConfig:
        return {
            "session_id": uuid.uuid1().__str__(),
            "user_id": "1"
        }


if __name__ == '__main__':
    unittest.main(warnings='ignore')
