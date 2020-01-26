import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SidebarLink from './SidebarLink';
import SidebarCategory from './SidebarCategory';

class SidebarContent extends Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
  };

  hideSidebar = () => {
    const { onClick } = this.props;
    onClick();
  };


  render() {
    return (
      <div className="sidebar__content">
        <ul className="sidebar__block">
          <SidebarLink title="ภาพรวมโครงการวิจัย" icon="layers" route="/dashboard_booking" onClick={this.hideSidebar} />
          <SidebarLink title="สถานะโครงการ" icon="home" route="/forms/home" onClick={this.hideSidebar} />
        </ul>
        <ul className="sidebar__block">
          <SidebarCategory title="ข้อเสนอโครงการวิจัย" icon="layers">
            <SidebarLink title="ขอพิจารณาเพื่อรับรองโครงการวิจัยใหม่" route="/forms/menuA/menuA1" onClick={this.hideSidebar} />
            <SidebarLink title="ขอพิจารณาเพื่อรับรองห้องปฏิบัติการ" route="/forms/menuA/menuA2" onClick={this.hideSidebar} />
            <SidebarLink title="รายงานความก้าวหน้าโครงการ" route="/forms/menuA/menuA3" onClick={this.hideSidebar} />
            <SidebarLink title="ขอแก้ไขโครงการตามมติคณะกรรมการ" route="/forms/menuA/menuA4" onClick={this.hideSidebar} />
            <SidebarLink title="ขอแก้ไขโครงการที่ผ่านการรับรอง" route="/forms/menuA/menuA5" onClick={this.hideSidebar} />
            <SidebarLink title="ขอต่ออายุโครงการ" route="/forms/menuA/menuA6" onClick={this.hideSidebar} />
            <SidebarLink title="แจ้งปิดโครงการ" route="/forms/menuA/menuA7" onClick={this.hideSidebar} />
          </SidebarCategory>
          <SidebarCategory title="บริหารข้อเสนอโครงการวิจัย" icon="layers">
            <SidebarLink title="ตรวจสอบข้อเสนอและแจ้งผลเบื้องต้น" route="/forms/menuB/menuB1" onClick={this.hideSidebar} />
          </SidebarCategory>
          <SidebarCategory title="พิจารณาข้อเสนอโครงการวิจัย" icon="layers">
            <SidebarLink title="การมอบหมายผู้พิจารณาโครงการ" route="/forms/menuC/menuC1" onClick={this.hideSidebar} />
            <SidebarLink title="ความเห็นของกรรมการผู้พิจารณา" route="/forms/menuC/menuC2" onClick={this.hideSidebar} />
          </SidebarCategory>
          <SidebarCategory title="มติคณะกรรมการ" icon="layers">
            <SidebarLink title="1. บันทึกการประชุม" route="/forms/menuC/menuC3" onClick={this.hideSidebar} />
            <SidebarLink title="2. ระเบียบวาระที่ 1" route="/forms/menuC/menuC3_1" onClick={this.hideSidebar} />
            <SidebarLink title="3. ระเบียบวาระที่ 2" route="/forms/menuC/menuC3_2" onClick={this.hideSidebar} />
            <SidebarLink title="4. ระเบียบวาระที่ 3" route="/forms/menuC/menuC3_3" onClick={this.hideSidebar} />
            <SidebarLink title="5. ระเบียบวาระที่ 4" route="/forms/menuC/menuC3_4" onClick={this.hideSidebar} />
            <SidebarLink title="6. ระเบียบวาระที่ 5" route="/forms/menuC/menuC3_5" onClick={this.hideSidebar} />
            <SidebarLink title="7. พิมพ์รายงาน" route="/forms/menuC/menuC3_Report" onClick={this.hideSidebar} />
          </SidebarCategory>
          <SidebarCategory title="ติดตามโครงการวิจัย" icon="layers">
            <SidebarLink title="ออกใบรับรองโครงการผ่านการประเมิน" route="/forms/menuD/menuD1" onClick={this.hideSidebar} />
            <SidebarLink title="ปิดโครงการและบรรจุวาระพิจารณารับรอง" route="/forms/menuD/menuD2" onClick={this.hideSidebar} />
          </SidebarCategory>
          <SidebarCategory title="รายงาน" icon="layers">
            <SidebarLink title="ดาวน์โหลดแบบฟอร์ม" route="/forms/menuA/menuA8" onClick={this.hideSidebar} />
          </SidebarCategory>
          <SidebarCategory title="ผู้ดูแลระบบ" icon="layers">
            <SidebarLink title="กำหนดสิทธิ์ตามกลุ่ม" route="/forms/menuF/menuF2" onClick={this.hideSidebar} />
            <SidebarLink title="จัดการข้อมูลสมาชิก" route="/forms/menuF/menuF1" onClick={this.hideSidebar} />
          </SidebarCategory>
        </ul>
      </div>
    );
  }
}

export default SidebarContent;
