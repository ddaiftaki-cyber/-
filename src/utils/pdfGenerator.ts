import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TECH_SPECS } from '../data/productData';

export interface PDFGenerateOptions {
  includePricing?: boolean;
  docTitle?: string;
}

export async function generateTechSpecsPDF(options: PDFGenerateOptions = {}): Promise<void> {
  // Create an off-screen container element with exact A4 aspect ratio and pristine typography
  const container = document.createElement('div');
  container.id = 'v380-pdf-render-root';
  container.style.position = 'fixed';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.style.width = '800px';
  container.style.minHeight = '1130px';
  container.style.backgroundColor = '#0b0f19';
  container.style.color = '#e2e8f0';
  container.style.fontFamily = "'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
  container.style.direction = 'rtl';
  container.style.padding = '36px 40px';
  container.style.boxSizing = 'border-box';
  container.style.zIndex = '-1000';

  const issueDate = new Date().toLocaleDateString('ar-DZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  container.innerHTML = `
    <div style="border: 2px solid #1e293b; border-radius: 20px; padding: 28px; background: linear-gradient(180deg, #0f172a 0%, #080d1a 100%); position: relative; box-shadow: inset 0 0 40px rgba(0,240,255,0.05);">
      
      <!-- Top Decorative Accent Bar -->
      <div style="position: absolute; top: 0; right: 40px; left: 40px; height: 4px; background: linear-gradient(90deg, #00f0ff, #38bdf8, #fbbf24); border-radius: 0 0 4px 4px;"></div>

      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1e293b; padding-bottom: 20px; margin-bottom: 24px;">
        <div style="text-align: right;">
          <div style="display: inline-block; background: rgba(0, 240, 255, 0.12); border: 1px solid rgba(0, 240, 255, 0.35); color: #38bdf8; font-size: 11px; font-weight: bold; padding: 4px 12px; border-radius: 999px; margin-bottom: 8px;">
            📄 البطاقة التقنية الرسمية المعتمدة (OFFICIAL TECHNICAL DATASHEET)
          </div>
          <h1 style="font-size: 24px; font-weight: 900; margin: 0 0 6px 0; color: #ffffff; letter-spacing: -0.5px;">
            كاميرا V380 Pro المزدوجة بالطاقة الشمسية وشريحة 4G
          </h1>
          <div style="font-size: 13px; color: #94a3b8; font-weight: 500;">
            V380 Pro 4K Dual-Lens Solar & 4G LTE Autonomous PTZ Security Camera
          </div>
        </div>

        <div style="text-align: left; direction: ltr;">
          <div style="background: #0284c7; color: #ffffff; font-weight: 900; font-size: 14px; padding: 6px 14px; border-radius: 10px; display: inline-block; letter-spacing: 1px;">
            V380 PRO™
          </div>
          <div style="font-size: 10px; color: #64748b; margin-top: 6px; font-family: monospace;">
            REF: DOC-V380-DZ-2026<br/>
            DATE: ${issueDate}
          </div>
        </div>
      </div>

      <!-- Key Highlights Badges Row -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 22px;">
        <div style="background: #111c30; border: 1px solid #1e293b; border-radius: 12px; padding: 10px; text-align: center;">
          <div style="font-size: 11px; color: #38bdf8; font-weight: bold;">عدستان متزامنتان</div>
          <div style="font-size: 13px; color: #ffffff; font-weight: 800; margin-top: 2px;">4K Dual Lens 360°</div>
        </div>
        <div style="background: #111c30; border: 1px solid #1e293b; border-radius: 12px; padding: 10px; text-align: center;">
          <div style="font-size: 11px; color: #fbbf24; font-weight: bold;">طاقة شمسية دائمة</div>
          <div style="font-size: 13px; color: #ffffff; font-weight: 800; margin-top: 2px;">20,000mAh Battery</div>
        </div>
        <div style="background: #111c30; border: 1px solid #1e293b; border-radius: 12px; padding: 10px; text-align: center;">
          <div style="font-size: 11px; color: #34d399; font-weight: bold;">شريحة 4G الجزائر</div>
          <div style="font-size: 13px; color: #ffffff; font-weight: 800; margin-top: 2px;">Mobilis/Djezzy/Ooredoo</div>
        </div>
        <div style="background: #111c30; border: 1px solid #1e293b; border-radius: 12px; padding: 10px; text-align: center;">
          <div style="font-size: 11px; color: #a78bfa; font-weight: bold;">مقاومة للعوامل</div>
          <div style="font-size: 13px; color: #ffffff; font-weight: 800; margin-top: 2px;">IP66 Waterproof</div>
        </div>
      </div>

      <!-- Main Specifications Groups -->
      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${TECH_SPECS.map(
          (group, gIdx) => `
          <div style="background: #0d1526; border: 1px solid #1e293b; border-radius: 14px; overflow: hidden;">
            <!-- Group Header -->
            <div style="background: #162238; padding: 8px 16px; border-bottom: 1px solid #1e293b; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 12px; font-weight: 800; color: #38bdf8;">
                ${gIdx + 1}. ${group.category}
              </span>
              <span style="font-size: 10px; color: #64748b; font-weight: bold;">معتمد 100%</span>
            </div>
            
            <!-- Items Table -->
            <div style="padding: 6px 16px;">
              ${group.items
                .map(
                  (item, iIdx) => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 7px 0; ${
                  iIdx < group.items.length - 1 ? 'border-bottom: 1px solid rgba(30, 41, 59, 0.6);' : ''
                }">
                  <span style="font-size: 11px; color: #94a3b8; font-weight: 600; width: 35%;">
                    ${item.name}:
                  </span>
                  <span style="font-size: 11px; color: ${item.highlight ? '#38bdf8' : '#e2e8f0'}; font-weight: ${
                    item.highlight ? '700' : '500'
                  }; text-align: left; width: 65%;">
                    ${item.value}
                  </span>
                </div>
              `
                )
                .join('')}
            </div>
          </div>
        `
        ).join('')}
      </div>

      <!-- Commercial Details & Guarantee Box -->
      <div style="margin-top: 20px; background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 14px; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center;">
        <div style="text-align: right;">
          <div style="font-size: 12px; font-weight: 800; color: #10b981; margin-bottom: 3px;">
            🇩🇿 شروط التوصيل والضمان في الجزائر:
          </div>
          <div style="font-size: 11px; color: #cbd5e1; line-height: 1.5;">
            • السعر الترويجي الرسمي: <strong style="color: #fbbf24;">36,000 د.ج (3 ملايين و 600 ألف سنتيم)</strong>.<br/>
            • توصيل مجاني وسريع لكافة الـ 58 ولاية • الدفع عند الاستلام بعد المعاينة والتجربة ("ما تخلص حتى تسييها").<br/>
            • ضمان ذهبي معتمد لمدة سنتين مع استبدال فوري ودعم فني مخصص.
          </div>
        </div>

        <div style="text-align: center; background: #0b1323; border: 1px solid #1e293b; padding: 8px 14px; border-radius: 10px;">
          <div style="font-size: 10px; color: #94a3b8; font-weight: bold;">خدمة الزبائن والطلبات</div>
          <div style="font-size: 14px; font-weight: 900; color: #34d399; font-family: monospace; direction: ltr; margin-top: 2px;">
            0652058044
          </div>
        </div>
      </div>

      <!-- Footer & Certifications -->
      <div style="margin-top: 18px; border-top: 1px solid #1e293b; padding-top: 12px; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #64748b;">
        <div>
          شهادات الجودة المعتمدة: CE • FCC • RoHS • ISO9001 • IP66 Certified
        </div>
        <div>
          جميع الحقوق محفوظة © V380 Pro Algeria — وثيقة رسمية صادرة للمستهلك
        </div>
      </div>

    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2, // High resolution for crisp text
      useCORS: true,
      backgroundColor: '#0b0f19',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`V380-Pro-Datasheet-DZ-${Date.now()}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}
