import React from 'react';
import {
  Card, CardBody, Col, Table,
} from 'reactstrap';
import { withTranslation } from 'react-i18next';

const PageForms = () => (
  <Col md={12} lg={12}>
    <Card>
      <CardBody>
        <Table responsive hover>
          <thead>
            <tr>
              <th>รหัสเอกสาร</th>
              <th>ชื่อเอกสาร</th>
              <th>ไฟล์</th>
              <th>ไฟล์</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>NUIBC01-2</td>
              <td>แบบเสนอเพื่อขอรับการพิจารณารับรองด้านความปลอดภัยทางชีวภาพระดับห้องปฏิบัติการ</td>
              <td><p><a href="/docs/doc/NUIBC01-2.doc" download target="_blank">.doc</a></p></td>
              <td><p><a href="/docs/pdf/NUIBC01-2.pdf" download target="_blank">.pdf</a></p></td>
            </tr>
            <tr>
              <td>NUIBC02-2</td>
              <td>แบบเสนอเพื่อขอรับการพิจารณารับรองด้านความปลอดภัยทางชีวภาพระดับภาคสนาม</td>
              <td><p><a href="/docs/doc/NUIBC02-2.doc" download target="_blank">.doc</a></p></td>
              <td><p><a href="/docs/pdf/NUIBC02-2.pdf" download target="_blank">.pdf</a></p></td>
            </tr>
            <tr>
              <td>NUIBC04</td>
              <td>แบบฟอร์มสำหรับเคลื่อนย้ำยสิ่งมีชีวิตดัดแปลงพันธุกรรมุลินทรีย์ก่อโรค แมลงและสัตว์ที่เป็นพำหะ ระหว่ำงสถำบันมหำวิทยำลัยนเรศวร</td>
              <td><p><a href="/docs/doc/NUIBC04.doc" download target="_blank">.doc</a></p></td>
              <td><p><a href="/docs/pdf/NUIBC04.pdf" download target="_blank">.pdf</a></p></td>
            </tr>
            <tr>
              <td>NUIBC05</td>
              <td>Naresuan University Material Transfer Agreement (MTA)</td>
              <td><p><a href="/docs/doc/NUIBC05.doc" download target="_blank">.doc</a></p></td>
              <td><p><a href="/docs/pdf/NUIBC05.pdf" download target="_blank">.pdf</a></p></td>
            </tr>
            <tr>
              <td>NUIBC06</td>
              <td>บันทึกข้อความ ขอชี้แจ้ง/แก้ไข โครงการวิจัยตามมติของคณะกรรมการเพื่อความปลอดภัยทางชีวภาพ</td>
              <td><p><a href="/docs/doc/NUIBC06.doc" download target="_blank">.doc</a></p></td>
              <td><p><a href="/docs/pdf/NUIBC06.pdf" download target="_blank">.pdf </a></p></td>
            </tr>
            <tr>
              <td>NUIBC07</td>
              <td>บันทึกข้อความ ขอปรับแก้โครงการวิจัยที่ผ่านการรับรองจากคณะกรรมการเพื่อความปลอดภัยทางชีวภาพมหาวิทยาลัยนเรศวร</td>
              <td><p><a href="/docs/doc/NUIBC07.doc" download target="_blank">.doc</a></p></td>
              <td><p><a href="/docs/pdf/NUIBC07.pdf" download target="_blank">.pdf</a></p></td>
            </tr>
            <tr>
              <td>NUIBC08</td>
              <td>บันทึกข้อความ ขอรายงานความก้าวหน้าโครงการวิจัยที่ผ่านการรับรองจากคณะกรรมการเพื่อความปลอดภัยทางชีวภาพ มหาวิทยาลัยนเรศวร</td>
              <td><p><a href="/docs/doc/NUIBC08.doc" download target="_blank">.doc</a></p></td>
              <td><p><a href="/docs/pdf/NUIBC08.pdf" download target="_blank">.pdf</a></p></td>
            </tr>
            <tr>
              <td>NUIBC09</td>
              <td>บันทึกข้อความ ขอต่ออายุโครงการวิจัยที่ผ่านการรับรองจากคณะกรรมการเพื่อความปลอดภัยทางชีวภาพมหาวิทยาลัยนเรศวร</td>
              <td><p><a href="/docs/doc/NUIBC09.doc" download target="_blank">.doc</a></p></td>
              <td><p><a href="/docs/pdf/NUIBC09.pdf" download target="_blank">.pdf</a></p></td>
            </tr>
            <tr>
              <td>NUIBC10</td>
              <td>บันทึกข้อความ ขอปิดโครงการวิจัยที่ผ่านการรับรองจากคณะกรรมการเพื่อความปลอดภัยทางชีวภาพมหาวิทยาลัยนเรศวร</td>
              <td><p><a href="/docs/doc/NUIBC10.doc" download target="_blank">.doc</a></p></td>
              <td><p><a href="/docs/pdf/NUIBC10.pdf" download target="_blank">.pdf</a></p></td>
            </tr>
            <tr>
              <td>DOC001</td>
              <td>แบบประเมินเบื้องต้นส ำหรับโรงเรือนทดลองส ำหรับพืชดัดแปลงพันธุกรรม (BSL 2)</td>
              <td><p><a href="/docs/doc/DOC001.doc" download target="_blank">.doc</a></p></td>
              <td><p><a href="/docs/pdf/DOC001.pdf" download target="_blank">.pdf</a></p></td>
            </tr>
            <tr>
              <td>DOC002</td>
              <td>แบบประเมินเบื้องต้นส ำหรับห้องปฏิบัติกำร (BSL2)</td>
              <td><p><a href="/docs/doc/DOC002.doc" download target="_blank">.doc</a></p></td>
              <td><p><a href="/docs/pdf/DOC002.pdf" download target="_blank">.pdf</a></p></td>
            </tr>
          </tbody>
        </Table>
      </CardBody>
    </Card>
  </Col>
);

export default withTranslation('common')(PageForms);
