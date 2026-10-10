import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Khởi tạo Gemini client server-side
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const SYSTEM_INSTRUCTION = `
Bạn là Cố Vấn Thời Trang & Nghiên Cứu Văn Hóa cho ứng dụng "Việt phục Remix - Phối trang phục truyền thống theo phong cách Gen Z".
Mục tiêu của bạn: Giúp người trẻ Việt Nam tự tin remix trang phục truyền thống với phụ kiện, layer hiện đại mà KHÔNG làm sai lệch hay xúc phạm giá trị văn hóa.

CÁC NGUYÊN TẮC BẤT DI BẤT DỊCH:
1. Luôn bám sát nghiêm ngặt các quy chuẩn lịch sử:
   - Áo ngũ thân tay chẽn & Áo Tấc: Cổ đứng (Lập lĩnh), 5 thân, cúc cài sang bên sườn PHẢI (tuyệt đối không cài sang trái).
   - Áo Giao lĩnh: Vạt TRÁI đè lên vạt PHẢI (bắt chéo chữ Y). Vạt phải đè vạt trái là quy cách người mất.
   - Áo Nhật bình: Là đại lễ phục cung đình, có nẹp cổ chữ nhật và dải ngũ sắc, luôn phải có áo ngũ thân lót bên trong, không tùy tiện mặc đi bar/pub hay bối cảnh xô bồ.
   - Áo Tứ thân: Không cài cúc kín, buông hoặc buộc vạt trước, mặc kèm yếm kín đáo.
   - Áo Bà ba: Xẻ tà hông phóng khoáng Nam Bộ, không gán ghép phụ kiện đặc thù quan họ Bắc Bộ (như nón quai thao).
2. KHÔNG TỰ BỊA ĐẶT THÔNG TIN: Nếu người dùng hỏi điều gì mà tư liệu lịch sử còn tranh cãi hoặc chưa rõ ràng, bạn phải trả lời rõ ràng: "Hiện tư liệu lịch sử chưa có thông tin chính thức được kiểm chứng về chi tiết này" thay vì phỏng đoán.
3. Giọng điệu: Thân thiện, tôn trọng, giàu cảm hứng văn hóa, đậm chất Gen Z thời trang nhưng tuyệt đối nghiêm túc khi nói về quy tắc di sản.
4. Trả lời súc tích, ngắn gọn (tối đa 3-4 câu/đoạn), định dạng rõ ràng.
`;

export async function generateStylingAdvice(params: {
  costumeName: string;
  eventName: string;
  colorName: string;
  styleName: string;
  bottomName: string;
  footwearName: string;
  accessoriesNames: string[];
}): Promise<string> {
  if (!apiKey) {
    return 'Gợi ý phối đồ: Set đồ của bạn kết hợp nét truyền thống trang nhã với phụ kiện hiện đại, rất năng động và phù hợp để lưu giữ thanh xuân!';
  }

  try {
    const prompt = `
Người dùng đang phối set đồ:
- Áo gốc: ${params.costumeName}
- Sự kiện / Bối cảnh: ${params.eventName}
- Màu sắc chủ đạo: ${params.colorName}
- Phong cách: ${params.styleName}
- Phía dưới (Hạ y): ${params.bottomName}
- Giày dép: ${params.footwearName}
- Phụ kiện: ${params.accessoriesNames.join(', ') || 'Không chọn'}

Hãy đưa ra:
1. Đánh giá nhanh về sự hài hòa & cá tính của bộ outfit này (1-2 câu).
2. Lời khuyên stylist giúp bạn trẻ tự tin tỏa sáng đúng bối cảnh mà vẫn chuẩn chỉ văn hóa (1-2 câu).
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    return response.text?.trim() || 'Set đồ kết hợp độc đáo, thể hiện tinh thần trân trọng di sản của người trẻ đương đại!';
  } catch (error) {
    console.error('Error generating styling advice:', error);
    return 'Set đồ kết hợp hài hòa nét truyền thống và hơi thở đương đại, rất hợp để diện chụp hình và dạo phố!';
  }
}

export async function explainColorAesthetics(params: {
  costumeName: string;
  colorName: string;
  colorElement: string;
  bottomName: string;
}): Promise<string> {
  if (!apiKey) {
    return `Sắc màu ${params.colorName} kết hợp cùng ${params.bottomName} mang đến thị giác thanh thoát, tôn dáng người mặc.`;
  }

  try {
    const prompt = `
Phân tích thẩm mỹ và ý nghĩa màu sắc:
- Màu áo: ${params.colorName} (Hành ${params.colorElement} trong Ngũ Hành)
- Mẫu áo: ${params.costumeName}
- Phối cùng quần/váy: ${params.bottomName}

Giải thích ngắn gọn trong 2 câu: ý nghĩa văn hóa của màu sắc này và tại sao sự kết hợp này lại tạo nên phong thái đẹp mắt cho người mặc.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.6,
      },
    });

    return response.text?.trim() || `Sắc màu ${params.colorName} tôn lên đường nét thanh lịch của áo, tạo tổng thể hài hòa và thu hút.`;
  } catch (error) {
    console.error('Error explaining color aesthetics:', error);
    return `Sắc màu ${params.colorName} tôn lên vẻ trang nhã, giàu sức sống cho tổng thể trang phục.`;
  }
}

export async function generateOutfitImage(params: {
  gender: 'female' | 'male';
  baseImageBase64?: string;
  prompt: string;
  costumeId: string;
  colorId: string;
}): Promise<{
  success: boolean;
  imageBase64?: string;
  error?: string;
  requiresPaid?: boolean;
}> {
  if (!apiKey) {
    return {
      success: false,
      error: 'GEMINI_API_KEY chưa được cấu hình trên máy chủ.',
    };
  }

  try {
    let contents: any;
    if (params.baseImageBase64) {
      const cleanData = params.baseImageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      contents = [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: cleanData,
              },
            },
            {
              text: params.prompt,
            },
          ],
        },
      ];
    } else {
      contents = params.prompt;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image',
      contents,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
        responseFormat: {
          image: {
            aspectRatio: '3:4',
          },
        },
      },
    });

    const candidate = response.candidates?.[0];
    const parts = candidate?.content?.parts;
    const inlinePart = parts?.find((p: any) => p.inlineData && p.inlineData.mimeType?.startsWith('image/'));

    if (inlinePart?.inlineData?.data) {
      const mime = inlinePart.inlineData.mimeType || 'image/png';
      return {
        success: true,
        imageBase64: `data:${mime};base64,${inlinePart.inlineData.data}`,
      };
    }

    return {
      success: false,
      error: 'Mô hình không trả về dữ liệu ảnh inline.',
    };
  } catch (error: unknown) {
    const err = error as Error;
    console.warn('Lỗi gọi Gemini outfit image generation model:', err.message);
    const isQuotaOrPaid =
      err.message.includes('Quota') ||
      err.message.includes('429') ||
      err.message.includes('RESOURCE_EXHAUSTED') ||
      err.message.includes('Vertex AI');

    return {
      success: false,
      error: isQuotaOrPaid
        ? 'Mô hình tạo ảnh yêu cầu tài khoản Gemini trả phí hoặc đã đạt giới hạn quota.'
        : `Lỗi kết nối mô hình tạo ảnh: ${err.message}`,
      requiresPaid: isQuotaOrPaid,
    };
  }
}

export async function generateMaleCharacterImage(): Promise<{
  success: boolean;
  imageBase64?: string;
  error?: string;
  requiresPaid?: boolean;
  fallbackFile: string;
}> {
  const fallbackFile = '/characters/minh_triet_base.jpg';

  if (!apiKey) {
    return {
      success: false,
      error: 'GEMINI_API_KEY chưa được cấu hình trên máy chủ.',
      fallbackFile,
    };
  }

  const prompt = `Ảnh đính kèm là nhân vật nữ An Nhiên trong bộ nhân vật game 2D. Hãy vẽ nhân vật nam Minh Triết thuộc cùng bộ nhân vật: nam thanh niên Việt Nam khoảng 20 tuổi, giữ đúng phong cách nét vẽ, cách tô bóng cel-shading, tỉ lệ đầu thân khoảng 5,5 đầu, tư thế đứng, cách đặt hai tay, chiều cao nhân vật và khung hình của ảnh mẫu. Hình thể nam: vai rộng hơn nữ, eo thẳng, cổ dày vừa phải nối liền với vai, bàn tay lớn và gọn. Tóc đen ngắn gọn gàng, mái hơi bồng, rẽ nhẹ, vài sợi lòa xòa tự nhiên. Khuôn mặt tròn mềm, cằm không nhọn, mắt to có highlight, lông mày rõ, cười nhẹ, má hồng rất nhạt. Mặc áo thun trắng đơn giản và quần short trung tính. Toàn thân thấy rõ hai bàn tay và hai bàn chân, nền trắng thuần, không bóng đổ trên nền, không chữ, không logo, khung dọc 3:4.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: prompt,
    });

    const candidate = response.candidates?.[0];
    const parts = candidate?.content?.parts;
    const inlinePart = parts?.find((p) => p.inlineData && p.inlineData.mimeType?.startsWith('image/'));

    if (inlinePart?.inlineData?.data) {
      const mime = inlinePart.inlineData.mimeType || 'image/jpeg';
      return {
        success: true,
        imageBase64: `data:${mime};base64,${inlinePart.inlineData.data}`,
        fallbackFile,
      };
    }

    return {
      success: false,
      error: 'Mô hình không trả về dữ liệu ảnh inline. Sử dụng tệp ảnh chuẩn dự án.',
      fallbackFile,
    };
  } catch (error: unknown) {
    const err = error as Error;
    console.warn('Lỗi gọi Gemini image generation model:', err.message);
    const isQuotaOrPaid = err.message.includes('Quota') || err.message.includes('429') || err.message.includes('RESOURCE_EXHAUSTED') || err.message.includes('Vertex AI');

    return {
      success: false,
      error: isQuotaOrPaid
        ? 'Mô hình tạo ảnh trực tiếp yêu cầu tài khoản Gemini trả phí (Paid Tier / Quota hạn chế ở bản thử nghiệm). Ứng dụng cung cấp tệp ảnh nhân vật chuẩn thiết kế sẵn.'
        : `Lỗi kết nối mô hình tạo ảnh: ${err.message}`,
      requiresPaid: isQuotaOrPaid,
      fallbackFile,
    };
  }
}
