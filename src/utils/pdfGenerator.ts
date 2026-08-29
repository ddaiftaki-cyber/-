import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TECH_SPECS } from '../data/productData';

export interface PDFGenerateOptions {
  includePricing?: boolean;
  docTitle?: string;
}

export async function generateTechSpecsPDF(options: PDFGenerateOptions = {}): Promise<void> {
  const container = document.createElement('div');
  container.id = 'dimoss-pdf-render-root';
  container.style.position = 'fixed';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.style.width = '800px';
  container.style.minHeight = '1130px';
  container.style.backgroundColor = '#0c0a09';
  container.style.color = '#e7e5e4';
  container.style.fontFamily = "'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
  container.style.direction = 'rtl';
  container.style.padding = '36px 40px';
  container.style.boxSizing = 'border-box';
  container.style.zIndex = '-1000';

  const issueDate = new Date().toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  container.innerHTML = `
    <div style="border: 2px solid #292524; border-radius: 20px; padding: 28px; background: linear-gradient(180deg, #1c1917 0%, #0c0a09 100%); position: relative; box-shadow: inset 0 0 40px rgba(212,175,55,0.05);">
      
      <!-- Top Decorative Gold Accent Bar -->
      <div style="position: absolute; top: 0; right: 40px; left: 40px; height: 4px; background: linear-gradient(90deg, #d4af37, #fef08a, #d4af37); border-radius: 0 0 4px 4px;"></div>

      <!-- Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #292524; padding-bottom: 20px; margin-bottom: 24px;">
        <div style="text-align: right;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
            <div style="background: #ffffff; padding: 4px 10px; border-radius: 8px; display: inline-flex; align-items: center;">
              <span style="color: #E30613; font-weight: 900; font-size: 18px; font-family: 'Cairo', sans-serif;">ديموس</span>
              <span style="color: #E30613; font-weight: 900; font-size: 16px; font-family: sans-serif; margin-right: 4px;">dimös</span>
            </div>
            <span style="background: rgba(227, 6, 19, 0.15); border: 1px solid rgba(227, 6, 19, 0.4); color: #fca5a5; font-size: 11px; font-weight: bold; padding: 3px 10px; border-radius: 999px;">
              A Style Statement Of Your Home 🇸🇦
            </span>
          </div>
          <h1 style="font-size: 22px; font-weight: 900; margin: 0 0 6px 0; color: #ffffff; letter-spacing: -0.5px;">
            مفروشات ديموس الفاخرة • كنب ومجالس السيادة الملكية
          </h1>
          <div style="font-size: 13px; color: #a8a29e; font-weight: 500;">
            DIMOSS Sovereign Modular Sofa System & Royal Majlis Collection
          </div>
        </div>

        <div style="text-align: left; direction: ltr;">
          <div style="background: #E30613; color: #ffffff; font-weight: 900; font-size: 14px; padding: 6px 14px; border-radius: 10px; display: inline-block; letter-spacing: 1px; box-shadow: 0 4px 12px rgba(227,6,19,0.3);">
            DIMOSS™ KSA
          </div>
          <div style="font-size: 10px; color: #78716c; margin-top: 6px; font-family: monospace;">
            REF: DOC-DIMOSS-KSA-2026<br/>
            DATE: ${issueDate}
          </div>
        </div>
      </div>

      <!-- Key Highlights Badges Row -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 22px;">
        <div style="background: #1c1917; border: 1px solid #292524; border-radius: 12px; padding: 10px; text-align: center;">
          <div style="font-size: 11px; color: #fbbf24; font-weight: bold;">خشب الهيكل</div>
          <div style="font-size: 13px; color: #ffffff; font-weight: 800; margin-top: 2px;">زان أوروبي أحمر</div>
        </div>
        <div style="background: #1c1917; border: 1px solid #292524; border-radius: 12px; padding: 10px; text-align: center;">
          <div style="font-size: 11px; color: #f59e0b; font-weight: bold;">كثافة الاسفنج</div>
          <div style="font-size: 13px; color: #ffffff; font-weight: 800; margin-top: 2px;">HR 45D + نوابض</div>
        </div>
        <div style="background: #1c1917; border: 1px solid #292524; border-radius: 12px; padding: 10px; text-align: center;">
          <div style="font-size: 11px; color: #34d399; font-weight: bold;">الأقمشة الذكية</div>
          <div style="font-size: 13px; color: #ffffff; font-weight: 800; margin-top: 2px;">نانو إيطالي ضد البقع</div>
        </div>
        <div style="background: #1c1917; border: 1px solid #292524; border-radius: 12px; padding: 10px; text-align: center;">
          <div style="font-size: 11px; color: #d4af37; font-weight: bold;">الضمان الذهبي</div>
          <div style="font-size: 13px; color: #ffffff; font-weight: 800; margin-top: 2px;">10 سنوات شامل</div>
        </div>
      </div>

      <!-- Main Specifications Groups -->
      <div style="display: flex; flex-direction: column; gap: 14px;">
        ${TECH_SPECS.map(
          (group, gIdx) => `
          <div style="background: #141210; border: 1px solid #292524; border-radius: 14px; overflow: hidden;">
            <div style="background: #1c1917; padding: 8px 16px; border-bottom: 1px solid #292524; display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 12px; font-weight: 800; color: #fbbf24;">
                ${gIdx + 1}. ${group.category}
              </span>
              <span style="font-size: 10px; color: #78716c; font-weight: bold;">مواصفة قياسية معتمدة</span>
            </div>
            
            <div style="padding: 6px 16px;">
              ${group.items
                .map(
                  (item, iIdx) => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 7px 0; ${
                  iIdx < group.items.length - 1 ? 'border-bottom: 1px solid rgba(41, 37, 36, 0.6);' : ''
                }">
                  <span style="font-size: 11px; color: #a8a29e; font-weight: 600; width: 35%;">
                    ${item.name}:
                  </span>
                  <span style="font-size: 11px; color: ${item.highlight ? '#fbbf24' : '#e7e5e4'}; font-weight: ${
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

      <!-- Saudi Delivery & Tabby/Tamara Box -->
      <div style="margin-top: 20px; background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 14px; padding: 14px 18px; display: flex; justify-content: space-between; align-items: center;">
        <div style="text-align: right;">
          <div style="font-size: 12px; font-weight: 800; color: #fbbf24; margin-bottom: 3px;">
            🇸🇦 خدمات ديموس الفندقية داخل المملكة العربية السعودية:
          </div>
          <div style="font-size: 11px; color: #d6d3d1; line-height: 1.5;">
            • توصيل وتركيب فندقي مجاني 100% لكافة مدن المملكة (الرياض، جدة، مكة، الدمام، الخبر، المدينة...).<br/>
            • تقسيط مريح على 4 دفعات بدون فوائد عبر تابي (Tabby) وتمارا (Tamara).<br/>
            • ضمان ذهبي شامل لمدة 10 سنوات على الهيكل والاسفنج مع استبدال فوري.
          </div>
        </div>

        <div style="text-align: center; background: #1c1917; border: 1px solid #292524; padding: 8px 14px; border-radius: 10px;">
          <div style="font-size: 10px; color: #a8a29e; font-weight: bold;">خدمة عملاء ديموس VIP</div>
          <div style="font-size: 14px; font-weight: 900; color: #fbbf24; font-family: monospace; direction: ltr; margin-top: 2px;">
            0501234567
          </div>
        </div>
      </div>

      <!-- Footer & Certifications -->
      <div style="margin-top: 18px; border-top: 1px solid #292524; padding-top: 12px; display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #78716c;">
        <div>
          شهادات المطابقة والجودة: SASO • ISO 9001 • OEKO-TEX Standard 100 • FSC Wood Certified
        </div>
        <div>
          جميع الحقوق محفوظة © مفروشات ديموس السعودية (DIMOSS KSA)
        </div>
      </div>

    </div>
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#0c0a09',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`Dimoss-Furniture-Catalog-${Date.now()}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}
