import { TRADITIONAL_COSTUMES, COLOR_OPTIONS, BOTTOMS, FOOTWEAR, ACCESSORIES, CostumeItem, ColorOption, ClothingPiece } from '../data/costumesData';

export interface OutfitFormula {
  gender: 'female' | 'male';
  costumeId: string;
  colorId: string;
  accessoryIds: string[];
  footwearId: string;
}

export interface CompleteOutfitDefinition {
  costumeId: string;
  name: string;
  historicalPeriod: string;
  genderCategory: string;
  topDetails: string;
  bottomPiece: string;
  wearStyle: string;
  culturalPromptDescription: string;
  silhouetteDescription: string;
}

/**
 * 7 bộ trang phục hoàn chỉnh được ánh xạ trực tiếp từ 7 món ở tab Áo cũ,
 * dựa trên chuẩn mực dữ liệu văn hóa lịch sử Việt Nam.
 */
export const COMPLETE_OUTFITS_MAP: Record<string, CompleteOutfitDefinition> = {
  ngu_than_tay_chen: {
    costumeId: 'ngu_than_tay_chen',
    name: 'Bộ Áo Ngũ thân tay chẽn',
    historicalPeriod: 'Triều Nguyễn (Thế kỷ 18–20)',
    genderCategory: 'Unisex (Nam & Nữ)',
    topDetails: 'Áo ngũ thân 5 vạt, cổ đứng Lập lĩnh ôm gọn 2-3cm để lộ viền trắng áo lót bên trong, 5 khuy cài sang nách phải, tay áo ôm chẽn gọn gàng từ bắp tay đến cổ tay, may bằng gấm lụa Hà Đông.',
    bottomPiece: 'Quần lụa trắng suông cổ truyền hoặc quần âu xếp ly ống suông thanh lịch.',
    wearStyle: 'Cài khuy bên phải, thân áo buông thẳng trang nhã, dáng dấp mực thước khiêm nhường.',
    culturalPromptDescription: 'Bộ Áo ngũ thân tay chẽn truyền thống Việt Nam thời Nguyễn gồm áo dài qua gối 5 thân, cổ đứng Lập lĩnh cao 2-3cm có viền lót trắng bên trong, 5 cúc cài vạt chéo sang nách bên phải, ống tay chẽn ôm gọn từ bắp tay đến cổ tay bằng lụa gấm Hà Đông, kết hợp quần lụa trắng suông cổ điển',
    silhouetteDescription: 'Áo ngũ thân tay chẽn, cổ đứng 5 cúc bên phải, quần suông',
  },
  ao_tac: {
    costumeId: 'ao_tac',
    name: 'Bộ Áo Tấc (Ngũ thân tay thụng)',
    historicalPeriod: 'Triều Nguyễn (Lễ phục quốc dân)',
    genderCategory: 'Unisex (Cả nam và nữ)',
    topDetails: 'Đại lễ phục áo ngũ thân 5 vạt bằng khép kín, cổ đứng Lập lĩnh trang nghiêm cài 5 khuy bên phải, ống tay thụng rất rộng và dài buông qua đầu ngón tay khoảng 1 tấc, chất vải gấm the hoa văn chữ Thọ.',
    bottomPiece: 'Quần lụa trắng suông dài chạm mu bàn chân.',
    wearStyle: 'Hai tay chắp nhẹ trước bụng hoặc thả buông khiêm nhường, thể hiện sự cung kính và tôn nghiêm.',
    culturalPromptDescription: 'Bộ Áo Tấc (áo ngũ thân tay thụng) đại lễ phục cung đình và dân gian thời Nguyễn gồm áo 5 thân dài qua gối khép kín, cổ đứng Lập lĩnh trang nghiêm cài 5 cúc bên phải, ống tay thụng rất rộng dài buông qua đầu ngón tay đúng 1 tấc bằng gấm dệt hoa văn chữ Thọ, kết hợp quần lụa trắng suông dài',
    silhouetteDescription: 'Áo Tấc tay thụng rộng dài qua đầu ngón tay, cổ lập lĩnh, quần lụa trắng',
  },
  ao_nhat_binh: {
    costumeId: 'ao_nhat_binh',
    name: 'Bộ Áo Nhật bình',
    historicalPeriod: 'Triều Nguyễn (Cung đình Huế)',
    genderCategory: 'Nữ giới',
    topDetails: 'Áo khoác đối khâm cung đình, cổ khoét hình chữ nhật lớn trước ngực có nẹp viền hoa văn thêu tinh xảo, tay áo viền dải ngũ sắc (xanh, vàng, trắng, đỏ, đen) tượng trưng ngũ hành, thêu loan phượng thủy ba.',
    bottomPiece: 'Áo ngũ thân lót bên trong và quần lụa trắng suông mềm mại.',
    wearStyle: 'Khoác thẳng đối khâm, nẹp cúc ngực cố định, đoan trang lộng lẫy chuẩn mực bậc Hậu phi.',
    culturalPromptDescription: 'Bộ Áo Nhật bình hoàng gia thời Nguyễn gồm áo khoác đối khâm có nẹp cổ hình chữ nhật to bản trước ngực thêu hoa văn cung đình, ống tay áo có dải viền vải ngũ sắc (xanh lá, vàng, trắng, đỏ, đen) ngũ hành rực rỡ, bên trong có lớp áo ngũ thân lót kín đáo, kết hợp quần lụa trắng cung đình thướt tha',
    silhouetteDescription: 'Áo Nhật bình cổ chữ nhật nẹp dày, viền tay ngũ sắc, áo lót và quần lụa trắng',
  },
  ao_giao_linh: {
    costumeId: 'ao_giao_linh',
    name: 'Bộ Áo Giao lĩnh (Giao cổ y)',
    historicalPeriod: 'Thời Lý - Trần - Lê (Thế kỷ 11–18)',
    genderCategory: 'Unisex (Nam & Nữ)',
    topDetails: 'Áo giao cổ cổ xưa của người Việt, vạt trái bắt buộc đè chéo lên vạt phải tạo cổ chữ Y giao hòa âm dương, ống tay thụng rộng buông rủ bằng lụa the mỏng nhẹ, dải đai lưng lụa mềm thắt ngang eo.',
    bottomPiece: 'Quần lụa trắng suông rộng hoặc thường sam bên dưới.',
    wearStyle: 'Thắt đai ngang hông, tà áo bay bổng khoan thai, tinh thần tự tại của nền văn minh Đại Việt.',
    culturalPromptDescription: 'Bộ Áo Giao lĩnh (Giao cổ y) Đại Việt thời Lý-Trần-Lê gồm cổ áo bắt chéo hình chữ Y với vạt trái đè lên vạt phải, ống tay thụng rộng rãi bay bổng bằng vải the mỏng mát nhẹ nhiệt đới, thắt dải đai lưng lụa mềm ngang eo, kết hợp quần lụa trắng suông rộng',
    silhouetteDescription: 'Áo Giao lĩnh cổ chéo chữ Y (vạt trái đè phải), tay rộng, thắt đai lụa eo',
  },
  ao_tu_than: {
    costumeId: 'ao_tu_than',
    name: 'Bộ Áo Tứ thân & Váy đụp',
    historicalPeriod: 'Đồng bằng Bắc Bộ & Quan họ Kinh Bắc',
    genderCategory: 'Nữ giới',
    topDetails: 'Áo 4 thân khoác ngoài (2 thân sau may liền sống lưng, 2 thân trước buông dài thắt vạt lụa điều đỏ thắm), bên trong mặc yếm đào cổ truyền kín đáo ôm sát ngực, chất liệu đũi mộc mạc.',
    bottomPiece: 'Váy đụp đen dân gian Bắc Bộ dài chấm gót chân.',
    wearStyle: 'Thắt vạt trước duyên dáng của thiếu nữ trẩy hội hoặc buông tà mộc mạc khi sinh hoạt.',
    culturalPromptDescription: 'Bộ Áo Tứ thân dân gian Bắc Bộ gồm áo 4 thân khoác ngoài màu sắc trang nhã, 2 thân trước thắt vạt duyên dáng ngang bụng, bên trong là yếm đào cổ truyền kín đáo thanh lịch, phía dưới mặc chân váy đụp đen dài chấm gót chân mộc mạc bằng vải đũi tự nhiên',
    silhouetteDescription: 'Áo Tứ thân khoác yếm đào, thắt vạt trước duyên dáng, váy đụp đen',
  },
  ao_ba_ba: {
    costumeId: 'ao_ba_ba',
    name: 'Bộ Áo Bà ba Nam Bộ',
    historicalPeriod: 'Đồng bằng sông Cửu Long',
    genderCategory: 'Unisex (Nam & Nữ)',
    topDetails: 'Thân áo ngắn ngang mông, xẻ tà 2 bên hông thoáng mát phóng khoáng, cổ tròn hoặc cổ sen nhẹ nhàng, hàng cúc cài chính giữa ngực, có 2 túi vuông phía trước tiện lợi.',
    bottomPiece: 'Quần lụa the đen hoặc lụa trắng ống suông rộng rãi.',
    wearStyle: 'Mặc buông thoải mái, đậm chất phóng khoáng, hiền hòa, chân chất người phương Nam.',
    culturalPromptDescription: 'Bộ Áo Bà ba Nam Bộ truyền thống gồm thân áo ngắn ngang mông có xẻ tà hai bên hông phóng khoáng, cổ tròn nhẹ nhàng, hàng cúc cài thẳng giữa ngực, hai túi vuông phía trước bằng vải kate hoặc lụa mềm, kết hợp quần lụa đen bóng hoặc lụa trắng suông rộng thoải mái',
    silhouetteDescription: 'Áo Bà ba xẻ tà hai bên hông, hàng cúc giữa ngực, quần lụa đen/trắng',
  },
  ao_dai_tan_thoi: {
    costumeId: 'ao_dai_tan_thoi',
    name: 'Bộ Áo dài tân thời',
    historicalPeriod: 'Thập niên 1930 đến nay (Toàn quốc)',
    genderCategory: 'Nữ giới (và biến thể nam hiện đại)',
    topDetails: 'Phom áo 2 thân thon dài bay bổng xẻ từ eo, cổ trụ thấp 2cm thanh nhã, tay raglan ôm mềm mại, tôn dáng bằng lụa tơ tằm thướt tha.',
    bottomPiece: 'Quần lụa trắng suông dài chấm gót chân.',
    wearStyle: 'Tà áo tung bay uyển chuyển khi bước đi, biểu tượng duyên dáng của phụ nữ Việt Nam.',
    culturalPromptDescription: 'Bộ Áo dài tân thời Việt Nam gồm hai thân tà trước và sau dài thướt tha qua gối xẻ từ eo, cổ trụ thấp 2cm thanh thoát, tay áo raglan ôm nhẹ nhàng bằng vải lụa tơ tằm mềm mại rủ tự nhiên, kết hợp quần lụa trắng suông dài bay bổng',
    silhouetteDescription: 'Áo dài 2 thân tà thon dài xẻ eo, cổ trụ thấp 2cm, quần lụa trắng suông',
  },
};

/**
 * Kiểm tra tính phù hợp giới tính của bộ trang phục.
 * Nếu không phù hợp, trả về ghi chú ngắn gọn theo đúng dữ liệu văn hóa (không ẩn đi).
 */
export function checkGenderCompatibility(
  gender: 'female' | 'male',
  costumeId: string
): { isCompatible: boolean; note: string } {
  const outfit = COMPLETE_OUTFITS_MAP[costumeId] || { genderCategory: 'Unisex (Nam & Nữ)' };

  if (gender === 'female') {
    return { isCompatible: true, note: 'Phù hợp nữ giới' };
  }

  // Đối với nhân vật nam (Minh Triết)
  switch (costumeId) {
    case 'ao_nhat_binh':
      return {
        isCompatible: false,
        note: 'Đại lễ phục nữ giới triều Nguyễn (Hậu phi, Công chúa)',
      };
    case 'ao_tu_than':
      return {
        isCompatible: false,
        note: 'Trang phục truyền thống phụ nữ Bắc Bộ (kèm yếm & váy đụp)',
      };
    case 'ao_dai_tan_thoi':
      return {
        isCompatible: false,
        note: 'Phổ biến nữ giới (cần kiểm chứng biến thể nam)',
      };
    case 'ngu_than_tay_chen':
    case 'ao_tac':
    case 'ao_giao_linh':
    case 'ao_ba_ba':
    default:
      return {
        isCompatible: true,
        note: 'Chuẩn mực Unisex (cả Nam và Nữ)',
      };
  }
}

/**
 * Tạo khóa định danh công thức độc nhất và nhất quán cho IndexedDB cache
 */
export function getOutfitKey(formula: OutfitFormula): string {
  const sortedAccessories = [...(formula.accessoryIds || [])].sort().join(',');
  return `${formula.gender}_${formula.costumeId}_${formula.colorId}_[${sortedAccessories}]_${formula.footwearId}`;
}

/**
 * Tạo prompt tạo ảnh ghép từ công thức theo đúng mẫu quy định:
 * "Dùng ảnh đính kèm làm gốc. Giữ nguyên hoàn toàn khuôn mặt, kiểu tóc, màu da, tư thế, tỉ lệ cơ thể, khung hình, nền trắng và phong cách vẽ. Chỉ thay trang phục thành: [mô tả chi tiết bộ đồ lấy từ dữ liệu văn hóa: kiểu cổ, số thân, tay áo, chất liệu, họa tiết], màu chủ đạo [màu], phụ kiện [danh sách], giày [giày]. Đây là trang phục truyền thống Việt Nam, không pha với trang phục Trung Quốc, Nhật hay Hàn. Vải có độ rủ tự nhiên, nếp gấp rõ, họa tiết tinh tế. Nền trắng thuần, không chữ, không logo."
 */
export function buildOutfitPrompt(formula: OutfitFormula): string {
  const outfitDef = COMPLETE_OUTFITS_MAP[formula.costumeId] || COMPLETE_OUTFITS_MAP['ngu_than_tay_chen'];
  const colorDef = COLOR_OPTIONS.find((c) => c.id === formula.colorId) || COLOR_OPTIONS[0];
  const footwearDef = FOOTWEAR.find((f) => f.id === formula.footwearId) || FOOTWEAR[0];
  
  const accList = formula.accessoryIds
    .map((accId) => ACCESSORIES.find((a) => a.id === accId)?.name)
    .filter(Boolean) as string[];
  const accString = accList.length > 0 ? accList.join(', ') : 'không đeo thêm phụ kiện rườm rà';

  return `Dùng ảnh đính kèm làm gốc. Giữ nguyên hoàn toàn khuôn mặt, kiểu tóc, màu da, tư thế, tỉ lệ cơ thể, khung hình, nền trắng và phong cách vẽ. Chỉ thay trang phục thành: ${outfitDef.culturalPromptDescription}, màu chủ đạo ${colorDef.name} (${colorDef.hex}), phụ kiện ${accString}, giày ${footwearDef.name}. Đây là trang phục truyền thống Việt Nam, không pha với trang phục Trung Quốc, Nhật hay Hàn. Vải có độ rủ tự nhiên, nếp gấp rõ, họa tiết tinh tế. Nền trắng thuần, không chữ, không logo.`;
}

