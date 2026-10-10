/**
 * Bộ dữ liệu chuẩn mực di sản Việt phục - "Việt phục Remix"
 * Biên soạn theo các nghiên cứu lịch sử trang phục Việt Nam
 */

export interface CostumeItem {
  id: string;
  name: string;
  period_region: string;
  gender_category: string;
  formality_level: 'casual' | 'ceremonial' | 'royal';
  characteristics: {
    collar: string;
    sleeves: string;
    panels: string;
    buttons: string;
    materials: string;
  };
  suitable_occasions: string[];
  cultural_meaning: string;
  common_mistakes: string[];
  verification_note: string;
  references: {
    title: string;
    authorOrOrg: string;
    note?: string;
  }[];
  defaultColor: string;
  defaultBottomId: string;
  defaultFootwearId: string;
  defaultAccessoryIds: string[];
  silhouetteSvg: string; // Key for visual rendering
}

export interface EventOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  recommendedCostumeIds: string[];
  recommendedStyles: ('traditional' | 'light_modern' | 'genz_streetwear')[];
  tag: string;
}

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  element: 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ';
  meaning: string;
  traditionalDye: string;
}

export interface ClothingPiece {
  id: string;
  name: string;
  category: 'bottom' | 'footwear' | 'accessory';
  type: string;
  formality: 'casual' | 'ceremonial' | 'royal';
  region?: 'bac' | 'trung' | 'nam' | 'toanquoc';
  description: string;
  imageHint: string;
}

export const EVENTS: EventOption[] = [
  {
    id: 'ky_yeu',
    name: 'Chụp Kỷ Yếu Thanh Xuân',
    icon: '📸',
    description: 'Năng động, trẻ trung, chụp ảnh kỷ niệm lớp và học sinh - sinh viên',
    recommendedCostumeIds: ['ngu_than_tay_chen', 'ao_dai_tan_thoi', 'ao_tac'],
    recommendedStyles: ['light_modern', 'genz_streetwear'],
    tag: 'Hot Trend Học Đường'
  },
  {
    id: 'tet_xuan',
    name: 'Du Xuân & Chúc Tết',
    icon: '🌸',
    description: 'Thanh lịch, lễ phép chúc Tết gia đình và dạo phố chụp ảnh OOTD',
    recommendedCostumeIds: ['ngu_than_tay_chen', 'ao_tac', 'ao_dai_tan_thoi'],
    recommendedStyles: ['traditional', 'light_modern'],
    tag: 'Không Khí Lễ Hội'
  },
  {
    id: 'thuyet_trinh',
    name: 'Thuyết Trình & Tốt Nghiệp',
    icon: '🎓',
    description: 'Trang trọng, tôn nghiêm tại giảng đường hoặc lễ nhận bằng tốt nghiệp',
    recommendedCostumeIds: ['ao_tac', 'ngu_than_tay_chen'],
    recommendedStyles: ['traditional', 'light_modern'],
    tag: 'Chuẩn Mực Học Thuật'
  },
  {
    id: 'dao_pho',
    name: 'Dạo Phố & Cà Phê Cuối Tuần',
    icon: '☕',
    description: 'Thoải mái, phóng khoáng, phối layer cùng phong cách thường ngày',
    recommendedCostumeIds: ['ngu_than_tay_chen', 'ao_ba_ba', 'ao_dai_tan_thoi'],
    recommendedStyles: ['genz_streetwear', 'light_modern'],
    tag: 'Urban Lifestyle'
  },
  {
    id: 'le_hoi_co_truyen',
    name: 'Lễ Hội & Sự Kiện Cổ Phong',
    icon: '🏮',
    description: 'Không gian văn hóa truyền thống, hội làng hoặc triển lãm mỹ thuật',
    recommendedCostumeIds: ['ao_giao_linh', 'ao_tu_than', 'ao_nhat_binh', 'ao_tac'],
    recommendedStyles: ['traditional'],
    tag: 'Cổ Phong Chuẩn Xác'
  }
];

export const COLOR_OPTIONS: ColorOption[] = [
  {
    id: 'do_son',
    name: 'Đỏ Son Chu Sa',
    hex: '#C0392B',
    element: 'Hỏa',
    meaning: 'Tượng trưng cho may mắn, hỷ sự, năng lượng sống mãnh liệt và quyền uy.',
    traditionalDye: 'Bột chu sa hoặc cánh kiến nhuộm điều'
  },
  {
    id: 'vang_nghe',
    name: 'Vàng Nghệ Hoàng Kim',
    hex: '#D97706',
    element: 'Thổ',
    meaning: 'Sắc thái ấm no, thịnh vượng, màu của đất mẹ bồi đắp và gấm vóc.',
    traditionalDye: 'Củ nghệ vàng già giã nhuyễn'
  },
  {
    id: 'cham_dam',
    name: 'Chàm Thẫm Núi Rừng',
    hex: '#1E293B',
    element: 'Thủy',
    meaning: 'Vẻ đẹp thâm trầm, trang nhã, tượng trưng cho trí tuệ và sự vững bền.',
    traditionalDye: 'Lá chàm ngâm ủ vôi tôi'
  },
  {
    id: 'nau_non',
    name: 'Nâu Non Đồng Bằng',
    hex: '#78350F',
    element: 'Thổ',
    meaning: 'Hồn quê mộc mạc, gần gũi với thiên nhiên, tượng trưng đức tính cần cù.',
    traditionalDye: 'Củ nâu rừng ngâm bùn sông Hồng'
  },
  {
    id: 'giay_do',
    name: 'Trắng Ngà Giấy Dó',
    hex: '#F5EFEB',
    element: 'Kim',
    meaning: 'Nét tinh khôi, giản dị và thanh khiết như trang sách cổ.',
    traditionalDye: 'Vỏ cây dó đập dập tự nhiên'
  },
  {
    id: 'men_lam',
    name: 'Men Lam Bát Tràng',
    hex: '#0D9488',
    element: 'Mộc',
    meaning: 'Thanh tao, tươi mới, màu của dòng nước thanh bình và gốm cổ truyền.',
    traditionalDye: 'Khoáng thạch men lam xanh'
  },
  {
    id: 'hong_sen',
    name: 'Hồng Sen Tây Hồ',
    hex: '#DB2777',
    element: 'Hỏa',
    meaning: 'Duyên dáng thiếu nữ, thơm ngát, biểu trưng sự thanh cao thuần hậu.',
    traditionalDye: 'Cánh hoa sen và lá móng tay'
  },
  {
    id: 'den_huyen',
    name: 'Đen Huyền Lụa The',
    hex: '#0F172A',
    element: 'Thủy',
    meaning: 'Sang trọng, huyền bí, thường dùng cho áo the lót gấm bên ngoài.',
    traditionalDye: 'Lá bàng già hoặc than đước'
  }
];

export const BOTTOMS: ClothingPiece[] = [
  {
    id: 'quan_lua_trang',
    name: 'Quần lụa trắng suông (Truyền thống)',
    category: 'bottom',
    type: 'silk_pants',
    formality: 'ceremonial',
    description: 'Dáng suông kinh điển bằng lụa Hà Đông, ống rộng thướt tha mềm mại',
    imageHint: 'white_silk'
  },
  {
    id: 'quan_lua_den',
    name: 'Quần lụa the đen (Truyền thống)',
    category: 'bottom',
    type: 'silk_pants',
    formality: 'ceremonial',
    description: 'Quần đen lụa tơ tằm cổ điển của nam và nữ thời Nguyễn',
    imageHint: 'black_silk'
  },
  {
    id: 'quan_au_suong',
    name: 'Quần âu xếp ly ống suông (Modern Chic)',
    category: 'bottom',
    type: 'trousers',
    formality: 'casual',
    description: 'Chất vải wool/cotton đứng form, thanh lịch hiện đại cho Gen Z',
    imageHint: 'pleated_trousers'
  },
  {
    id: 'quan_jeans_denim',
    name: 'Quần Jeans Denim ống đứng (Streetwear)',
    category: 'bottom',
    type: 'jeans',
    formality: 'casual',
    description: 'Chất liệu denim xanh cổ điển, tạo sự tương phản mạnh mẽ giữa cũ và mới',
    imageHint: 'denim_jeans'
  },
  {
    id: 'chan_vay_xep_ly',
    name: 'Chân váy dài xếp ly (Modern Minimal)',
    category: 'bottom',
    type: 'skirt',
    formality: 'casual',
    description: 'Váy dài qua gối bay bổng, tôn lên tà áo cách điệu',
    imageHint: 'pleated_skirt'
  },
  {
    id: 'vay_dup_den',
    name: 'Váy đụp đen dân gian (Bắc Bộ)',
    category: 'bottom',
    type: 'traditional_skirt',
    formality: 'casual',
    region: 'bac',
    description: 'Chân váy đen mộc mạc đặc trưng của phụ nữ nông thôn Bắc Bộ đi cùng Tứ thân',
    imageHint: 'traditional_black_skirt'
  }
];

export const FOOTWEAR: ClothingPiece[] = [
  {
    id: 'sneaker_trang',
    name: 'Sneaker trắng tối giản (Clean Streetwear)',
    category: 'footwear',
    type: 'sneakers',
    formality: 'casual',
    description: 'Giày thể thao trắng sạch sẽ, năng động cho học sinh - sinh viên',
    imageHint: 'white_sneaker'
  },
  {
    id: 'guoc_moc_nhung',
    name: 'Guốc mộc quai nhung (Heritage Vintage)',
    category: 'footwear',
    type: 'traditional_clogs',
    formality: 'ceremonial',
    description: 'Gỗ tự nhiên kêu lách cách vui tai, quai bọc nhung đỏ hoặc đen',
    imageHint: 'wooden_clogs'
  },
  {
    id: 'boots_da_co_lung',
    name: 'Boots da cổ lửng (Urban Edge)',
    category: 'footwear',
    type: 'leather_boots',
    formality: 'casual',
    description: 'Boots đen cá tính, giúp set đồ mang hơi thở thời trang quốc tế',
    imageHint: 'ankle_boots'
  },
  {
    id: 'giay_oxford_tay',
    name: 'Giày da Oxford / Loafer cổ điển',
    category: 'footwear',
    type: 'loafers',
    formality: 'ceremonial',
    description: 'Lịch lãm, chỉnh chu cho các buổi thuyết trình và lễ tốt nghiệp',
    imageHint: 'oxford_shoes'
  },
  {
    id: 'dep_quai_hau_minimal',
    name: 'Sandal quai da tối giản',
    category: 'footwear',
    type: 'sandals',
    formality: 'casual',
    description: 'Nhẹ nhàng, tiện lợi khi dạo phố cuối tuần',
    imageHint: 'minimal_sandals'
  }
];

export const ACCESSORIES: ClothingPiece[] = [
  {
    id: 'khan_van_dong',
    name: 'Khăn vấn / Khăn đóng truyền thống',
    category: 'accessory',
    type: 'turban',
    formality: 'ceremonial',
    description: 'Quấn xếp nhiều nếp tinh tế trên đầu, biểu tượng mực thước thời Nguyễn',
    imageHint: 'turban'
  },
  {
    id: 'non_la_chop',
    name: 'Nón lá chóp tre thanh nhã',
    category: 'accessory',
    type: 'hat',
    formality: 'casual',
    description: 'Biểu tượng gắn liền với áo dài và nụ cười Việt Nam',
    imageHint: 'conical_hat'
  },
  {
    id: 'non_quai_thao',
    name: 'Nón quai thao (Kinh Bắc)',
    category: 'accessory',
    type: 'hat',
    formality: 'ceremonial',
    region: 'bac',
    description: 'Nón thúng quai thao tròn vành lớn của liền chị quan họ',
    imageHint: 'quai_thao_hat'
  },
  {
    id: 'tui_tote_canvas',
    name: 'Túi tote canvas in typographic',
    category: 'accessory',
    type: 'bag',
    formality: 'casual',
    description: 'Món đồ bất ly thân của Gen Z khi đi học và đi cà phê',
    imageHint: 'tote_bag'
  },
  {
    id: 'kinh_mat_retro',
    name: 'Kính râm retro gọng oval',
    category: 'accessory',
    type: 'eyewear',
    formality: 'casual',
    description: 'Điểm nhấn thời trang phá cách cho bộ ảnh kỷ yếu chuẩn sành điệu',
    imageHint: 'sunglasses'
  },
  {
    id: 'vong_ngoc_trai',
    name: 'Chuỗi hạt ngọc trai cổ điển',
    category: 'accessory',
    type: 'jewelry',
    formality: 'ceremonial',
    description: 'Điểm nhấn quý phái tôn lên đường viền cổ áo Lập lĩnh',
    imageHint: 'pearl_necklace'
  },
  {
    id: 'quat_giay_thu_phap',
    name: 'Quạt giấy xếp nan tre thư pháp',
    category: 'accessory',
    type: 'prop',
    formality: 'casual',
    description: 'Phụ kiện cầm tay tao nhã khi chụp hình và dạo phố',
    imageHint: 'paper_fan'
  },
  {
    id: 'khan_vanh_day',
    name: 'Khăn vành dây cung đình Huế',
    category: 'accessory',
    type: 'royal_headwear',
    formality: 'royal',
    region: 'trung',
    description: 'Dải lụa the dài vấn nhiều vòng cẩn thận, chỉ dùng cho đại lễ và Nhật bình',
    imageHint: 'royal_crown'
  }
];

export const TRADITIONAL_COSTUMES: CostumeItem[] = [
  {
    id: 'ngu_than_tay_chen',
    name: 'Áo Ngũ thân tay chẽn',
    period_region: 'Triều Nguyễn (Thế kỷ 18–20) / Toàn quốc',
    gender_category: 'Unisex (Nam & Nữ)',
    formality_level: 'casual',
    characteristics: {
      collar: 'Cổ đứng (Lập lĩnh), cao 2-3 cm ôm gọn gàng',
      sleeves: 'Tay chẽn ôm vừa vặn từ bắp tay đến cổ tay, thuận tiện vận động',
      panels: '5 thân (4 thân ngoài tượng trưng tứ thân phụ mẫu, 1 thân con bên trong)',
      buttons: '5 cúc (đồng/ngọc/gỗ) cài vạt chéo sang nách phải',
      materials: 'Gấm, sa, lụa Hà Đông, đũi mộc'
    },
    suitable_occasions: [
      'Đi học, đi làm, thuyết trình văn hóa',
      'Dạo phố, cà phê, du xuân chúc Tết',
      'Chụp ảnh kỷ yếu thanh xuân'
    ],
    cultural_meaning: 'Ra đời từ cải cách trang phục của chúa Nguyễn Phúc Khoát và vua Minh Mạng, chiếc áo là biểu tượng của tinh thần tự chủ văn hóa và sự khiêm nhường. 5 thân áo nhắc nhở đạo hiếu cha mẹ và giữ gìn phẩm hạnh, còn 5 cúc áo là bài học về Ngũ thường (Nhân - Lễ - Nghĩa - Trí - Tín). Với Gen Z, đây là item chuẩn mực vừa cổ điển vừa cực kỳ năng động.',
    common_mistakes: [
      'Cài nhầm vạt sang bên trái (nguyên tắc bắt buộc là vạt ngoài cài sang nách phải).',
      'Bỏ qua lớp áo lót trắng bên trong làm mất vẻ trang nhã thanh khiết.',
      'May tà áo quét đất hoặc xẻ eo quá cao làm biến dạng phom dáng đứng đắn.'
    ],
    verification_note: 'Cấu trúc 5 thân cài bên phải đã được bảo chứng qua các sắc dụ triều Nguyễn và hiện vật trang phục lưu giữ tại bảo tàng.',
    references: [
      {
        title: 'Ngàn năm áo mũ',
        authorOrOrg: 'Trần Quang Đức (NXB Thế Giới)',
        note: 'Trang 280-310: Cải cách y phục thời Nguyễn'
      },
      {
        title: 'Trang phục Việt Nam qua các thời kỳ',
        authorOrOrg: 'Viện Mỹ thuật Việt Nam'
      }
    ],
    defaultColor: '#1E293B',
    defaultBottomId: 'quan_au_suong',
    defaultFootwearId: 'sneaker_trang',
    defaultAccessoryIds: ['tui_tote_canvas', 'kinh_mat_retro'],
    silhouetteSvg: 'ngu_than'
  },
  {
    id: 'ao_tac',
    name: 'Áo Tấc (Áo ngũ thân tay thụng)',
    period_region: 'Triều Nguyễn / Lễ phục quốc dân phổ biến toàn quốc',
    gender_category: 'Unisex (Cả nam và nữ)',
    formality_level: 'ceremonial',
    characteristics: {
      collar: 'Cổ đứng Lập lĩnh trang nghiêm',
      sleeves: 'Tay thụng (ống tay rất rộng, dài buông qua đầu ngón tay khoảng 1 tấc)',
      panels: '5 thân vạt bằng khép kín tôn nghiêm',
      buttons: '5 cúc cài vạt bên phải',
      materials: 'Gấm hoa dệt chữ Thọ, lụa the, sa mỏng'
    },
    suitable_occasions: [
      'Lễ tốt nghiệp đại học, trao bằng danh dự',
      'Lễ cưới hỏi, dâng hương, nghi thức gia tiên',
      'Tết Nguyên Đán chúc thọ ông bà'
    ],
    cultural_meaning: 'Áo Tấc là bộ lễ phục quốc dân thể hiện cốt cách đoan chính và sự cung kính của người mặc. Ống tay thụng dài khi chắp tay hành lễ thể hiện sự khiêm nhường, tĩnh lặng và thanh tao. Đây là trang phục tuyệt đẹp cho các khoảnh khắc bước ngoặt thiêng liêng của tuổi trẻ.',
    common_mistakes: [
      'Phối cùng quần jeans rách hầm hố hoặc quần short khi tham gia nghi lễ (gây lệch chuẩn trang nghiêm).',
      'Xắn ngược tay áo lên luộm thuộm (khi đi lại có thể vắt tay chéo qua bụng nhẹ nhàng).',
      'Không đội khăn đóng khi dự các sự kiện có nghi thức tế lễ.'
    ],
    verification_note: 'Quy cách ống tay dài quá đầu ngón tay là tiêu chuẩn đồng nhất trong các nghi lễ triều Nguyễn.',
    references: [
      {
        title: 'Đại Nam Thực Lục',
        authorOrOrg: 'Quốc sử quán triều Nguyễn'
      },
      {
        title: 'Trang phục triều Nguyễn',
        authorOrOrg: 'Nhà nghiên cứu Trần Đình Sơn'
      }
    ],
    defaultColor: '#D97706',
    defaultBottomId: 'quan_lua_trang',
    defaultFootwearId: 'giay_oxford_tay',
    defaultAccessoryIds: ['khan_van_dong', 'quat_giay_thu_phap'],
    silhouetteSvg: 'ao_tac'
  },
  {
    id: 'ao_nhat_binh',
    name: 'Áo Nhật bình',
    period_region: 'Triều Nguyễn (Thế kỷ 19–20) / Cung đình Huế & Lễ cưới xứ Huế',
    gender_category: 'Nữ giới',
    formality_level: 'royal',
    characteristics: {
      collar: 'Cổ áo khoét hình chữ nhật lớn trước ngực, nẹp hoa văn dày',
      sleeves: 'Tay áo có viền ngũ sắc (xanh, vàng, trắng, đỏ, đen) tượng trưng ngũ hành',
      panels: 'Dạng áo khoác đối khâm, hoa văn thêu phượng loan, thủy ba rực rỡ',
      buttons: 'Cố định bằng dải buộc dây hoặc nẹp khuy ngực',
      materials: 'Gấm cung đình, lụa thêu kim tuyến, sa ngũ sắc'
    },
    suitable_occasions: [
      'Lễ cưới hỏi truyền thống cung đình',
      'Biểu diễn văn hóa nghệ thuật di sản',
      'Triển lãm Festival áo dài'
    ],
    cultural_meaning: 'Vốn là thường phục cao quý của bậc Hậu phi, Công chúa thời Nguyễn, Nhật bình mang vẻ đẹp lộng lẫy tột bậc với cổ chữ nhật thể hiện sự ngay thẳng chính trực và dải tay áo ngũ hành hòa hợp trời đất. Mặc Nhật bình là cách người trẻ tôn vinh đỉnh cao mỹ nghệ thủ công hoàng gia.',
    common_mistakes: [
      'Mặc một mình mà không có áo ngũ thân lót bên trong (Nhật bình luôn là áo khoác ngoài).',
      'Phối với quần jeans rách hoặc giày sneaker thể thao hầm hố dạo phố bar/pub bừa bãi (làm mất tính tôn nghiêm lễ phục).',
      'Chọn màu vàng hoàng yến khi không phải bối cảnh nghiên cứu cung đình (trong lịch sử, màu vàng chính sắc chỉ dành cho Hoàng Thái Hậu và Hoàng Hậu).'
    ],
    verification_note: 'Cần kiểm chứng: Việc dân gian Huế sử dụng Nhật bình làm áo cưới xuất hiện từ cuối thời Nguyễn khi quy chế nới lỏng, không phải từ đầu triều.',
    references: [
      {
        title: 'Khâm định Đại Nam hội điển sự lệ',
        authorOrOrg: 'Nội các triều Nguyễn'
      },
      {
        title: 'Dệt nên triều đại (Weaving a Realm)',
        authorOrOrg: 'Vietnam Centre'
      }
    ],
    defaultColor: '#C0392B',
    defaultBottomId: 'quan_lua_trang',
    defaultFootwearId: 'guoc_moc_nhung',
    defaultAccessoryIds: ['khan_vanh_day', 'vong_ngoc_trai'],
    silhouetteSvg: 'nhat_binh'
  },
  {
    id: 'ao_giao_linh',
    name: 'Áo Giao lĩnh (Giao cổ y)',
    period_region: 'Thời Lý - Trần - Lê (Thế kỷ 11–18) / Miền Bắc & Trung',
    gender_category: 'Unisex (Nam & Nữ)',
    formality_level: 'casual',
    characteristics: {
      collar: 'Cổ giao nhau chéo hình chữ Y (vạt trái bắt buộc đè lên vạt phải)',
      sleeves: 'Tay thụng hoặc tay thường rộng rãi',
      panels: 'Thân áo dài buông thả, thắt đai lưng lụa mềm ngang eo',
      buttons: 'Thắt bằng dải dây vải bên sườn thay vì cúc tròn',
      materials: 'Lụa tơ tằm, the mỏng, đũi mộc'
    },
    suitable_occasions: [
      'Triển lãm mỹ thuật, dự án thiết kế đồ án văn hóa',
      'Chụp ảnh concept cổ phong Đại Việt',
      'Hội thảo, sự kiện lịch sử Lý - Trần - Lê'
    ],
    cultural_meaning: 'Giao lĩnh là một trong những dạng y phục cổ xưa nhất của nền văn minh Đại Việt thời kỳ tự chủ hưng thịnh Lý - Trần - Lê. Cổ áo bắt chéo biểu trưng cho âm dương giao hòa, tinh thần tự tại và đạo đức Nho giáo hòa quyện Phật giáo thời Lý Trần.',
    common_mistakes: [
      'Bắt vạt phải đè lên vạt trái (đây là quy cách áo người mất trong nghi thức cổ, tuyệt đối vạt trái phải đè lên vạt phải).',
      'Nhầm lẫn toàn bộ thành Hán phục/Kimono (Giao lĩnh Việt có hoa văn rồng giun thời Lý, lá đề, gốm men lam và chất liệu mỏng hợp khí hậu nhiệt đới).',
      'Cắt xẻ cổ ngực quá sâu hở hang.'
    ],
    verification_note: 'Cần kiểm chứng: Phom dáng chi tiết qua các thời Lý, Trần, Lê chủ yếu dựa trên tranh tượng chùa chiền và mộ hợp chất (như mộ xác ướp Bảo Hưng), một số đường may đang tiếp tục được phục dựng đối sánh.',
    references: [
      {
        title: 'Khảo cứu trang phục thời Lê qua tư liệu khảo cổ',
        authorOrOrg: 'Viện Khảo cổ học Việt Nam'
      },
      {
        title: 'Tranh tượng chùa Bút Tháp & Chùa Dâu',
        authorOrOrg: 'Tư liệu di sản mỹ thuật'
      }
    ],
    defaultColor: '#0D9488',
    defaultBottomId: 'quan_lua_trang',
    defaultFootwearId: 'dep_quai_hau_minimal',
    defaultAccessoryIds: ['quat_giay_thu_phap'],
    silhouetteSvg: 'giao_linh'
  },
  {
    id: 'ao_tu_than',
    name: 'Áo Tứ thân & Váy đụp',
    period_region: 'Đồng bằng Bắc Bộ / Phụ nữ nông thôn và Quan họ Kinh Bắc',
    gender_category: 'Nữ giới',
    formality_level: 'casual',
    characteristics: {
      collar: 'Không cổ hoặc cổ tròn lượn nhẹ, khoác để lộ yếm đào bên trong',
      sleeves: 'Tay áo hẹp vừa phải tiện lao động và sinh hoạt',
      panels: '4 thân (2 thân sau may liền sống lưng, 2 thân trước buông dài thắt vạt)',
      buttons: 'Không dùng cúc, thắt bằng dải lưng điều (lụa đỏ/hồng)',
      materials: 'Vải đũi, vải thô củ nâu non, lụa tơ gai mộc'
    },
    suitable_occasions: [
      'Hội làng mùa xuân, nghe hát quan họ',
      'Chụp ảnh dã ngoại làng quê đồng quê',
      'Biểu diễn văn nghệ truyền thống dân tộc'
    ],
    cultural_meaning: 'Áo Tứ thân là linh hồn Bắc Bộ, gắn liền với hình tượng người phụ nữ Việt tảo tần, khéo léo và giàu tình nghĩa. Bốn thân tượng trưng cho tứ thân phụ mẫu, dải thắt vạt trước tượng trưng cho sự gắn kết thủy chung vợ chồng.',
    common_mistakes: [
      'Mặc yếm khoét quá trễ tràng phản cảm (yếm cổ truyền may kín đáo, ôm vừa ngực).',
      'Phối cùng quần jeans rách hoặc váy ngắn cũn cỡn.',
      'Đính sequin kim tuyến lấp lánh như đồ diễn xiếc tạp kỹ làm mất chất mộc dân gian.'
    ],
    verification_note: 'Cách thắt vạt trước phổ biến ở thiếu nữ đi hội; còn khi lao động thường buông tà hoặc dắt vạt gọn gàng vào thắt lưng.',
    references: [
      {
        title: 'Văn hóa dân gian vùng Kinh Bắc',
        authorOrOrg: 'Hội Văn nghệ Dân gian Việt Nam'
      }
    ],
    defaultColor: '#78350F',
    defaultBottomId: 'vay_dup_den',
    defaultFootwearId: 'guoc_moc_nhung',
    defaultAccessoryIds: ['non_quai_thao'],
    silhouetteSvg: 'tu_than'
  },
  {
    id: 'ao_ba_ba',
    name: 'Áo Bà ba Nam Bộ',
    period_region: 'Đồng bằng sông Cửu Long / Thế kỷ 19 đến nay',
    gender_category: 'Unisex (Nam & Nữ)',
    formality_level: 'casual',
    characteristics: {
      collar: 'Cổ tròn, cổ tim hoặc cổ lá sen nhẹ nhàng',
      sleeves: 'Tay áo dài thon dài thẳng hoặc lửng nhẹ',
      panels: 'Thân ngắn ngang mông, xẻ tà 2 bên hông thoáng mát, 2 túi vuông phía trước',
      buttons: 'Hàng cúc bấm hoặc cúc nhựa dọc giữa ngực',
      materials: 'Vải kate, láng đen, lụa mỡ gà, voan xốp'
    },
    suitable_occasions: [
      'Du lịch sông nước miệt vườn miền Tây',
      'Hoạt động ngoại khóa trải nghiệm nông nghiệp sinh thái',
      'Đờn ca tài tử, liên hoan văn nghệ thanh niên'
    ],
    cultural_meaning: 'Cùng với chiếc khăn rằn và nón lá, áo bà ba là biểu tượng của tinh thần phóng khoáng, hiền hòa, chân chất của con người phương Nam. Đây chính là casual wear thuần khiết của người Việt.',
    common_mistakes: [
      'Chiết eo quá chặt biến thành áo croptop bó sát lố lăng.',
      'Phối với phụ kiện đặc thù Bắc Bộ như nón quai thao hay khăn mỏ quạ (râu ông nọ cắm cằm bà kia).',
      'Dùng vải quá mỏng nhìn xuyên thấu thiếu tế nhị.'
    ],
    verification_note: 'Cần kiểm chứng: Tên gọi "bà ba" có 2 giả thuyết (do du nhập từ cộng đồng Peranakan/Baba-Nyonya hay biến chuyển từ một kiểu áo do học giả Trương Vĩnh Ký truyền bá).',
    references: [
      {
        title: 'Văn minh miệt vườn',
        authorOrOrg: 'Nhà văn Sơn Nam'
      }
    ],
    defaultColor: '#1E293B',
    defaultBottomId: 'quan_lua_den',
    defaultFootwearId: 'dep_quai_hau_minimal',
    defaultAccessoryIds: ['non_la_chop'],
    silhouetteSvg: 'ba_ba'
  },
  {
    id: 'ao_dai_tan_thoi',
    name: 'Áo dài tân thời (Cách tân đúng mực)',
    period_region: 'Thập niên 1930 đến nay / Toàn quốc',
    gender_category: 'Nữ giới (và biến thể nam hiện đại)',
    formality_level: 'casual',
    characteristics: {
      collar: 'Cổ trụ thấp 1-3cm, cổ thuyền hoặc cổ tròn',
      sleeves: 'Tay raglan thanh thoát hoặc tay lỡ nhẹ nhàng',
      panels: '2 thân trước sau xẻ từ eo, tà áo thon dài bay bổng',
      buttons: 'Khuy bấm sườn phải hoặc khóa kéo ẩn sau lưng',
      materials: 'Lụa tơ tằm, linen mộc, gấm xốp, chiffon'
    },
    suitable_occasions: [
      'Lễ khai giảng, bế giảng, chụp ảnh kỷ yếu học sinh - sinh viên',
      'Chúc Tết gia đình, dạo phố du xuân',
      'Giao lưu thanh niên quốc tế'
    ],
    cultural_meaning: 'Thành quả giao thoa tuyệt mỹ giữa phom áo ngũ thân truyền thống và kỹ thuật dựng dáng hiện đại phương Tây thế kỷ 20, áo dài tân thời chứng minh di sản luôn sống động cùng nhịp đập đương đại của tuổi trẻ Việt.',
    common_mistakes: [
      'Xẻ tà eo quá cao lộ da thịt vòng eo.',
      'Phối cùng váy đụp quá ngắn cũn cỡn như thời trang trẻ em.',
      'Chất liệu may quá mỏng manh không có lớp lót bảo vệ nội y.'
    ],
    verification_note: 'Phân định rõ cách tân đúng mực tôn vinh nét duyên dáng với cách tân quá trớn gây phản cảm.',
    references: [
      {
        title: 'Lịch sử Áo dài Việt Nam',
        authorOrOrg: 'Bảo tàng Phụ nữ Việt Nam'
      }
    ],
    defaultColor: '#C0392B',
    defaultBottomId: 'quan_lua_trang',
    defaultFootwearId: 'sneaker_trang',
    defaultAccessoryIds: ['non_la_chop', 'tui_tote_canvas'],
    silhouetteSvg: 'ao_dai'
  }
];

export interface StylingRuleViolation {
  level: 'tip' | 'caution' | 'warning';
  title: string;
  message: string;
  recommendation?: string;
}

/**
 * Hệ thống Rule-based đánh giá mức độ phù hợp văn hóa
 */
export function checkCulturalRules(
  costume: CostumeItem,
  bottom: ClothingPiece,
  footwear: ClothingPiece,
  accessories: ClothingPiece[],
  selectedEventId?: string
): StylingRuleViolation[] {
  const violations: StylingRuleViolation[] = [];

  // Quy tắc 1: Lễ phục / Hoàng gia (Royal / Ceremonial) không phối với đồ streetwear quá gắt
  if (costume.formality_level === 'royal' && bottom.id === 'quan_jeans_denim') {
    violations.push({
      level: 'warning',
      title: 'Dễ gây hiểu lầm về tính trang nghiêm',
      message: `${costume.name} vốn là trang phục hoàng gia cung đình cao quý. Việc phối cùng quần Jeans rách/denim rất dễ gây cảm giác cẩu thả và mất đi vẻ tôn nghiêm di sản.`,
      recommendation: 'Hãy thử đổi sang quần lụa suông hoặc chân váy xếp ly dài trang nhã.'
    });
  }

  // Quy tắc 2: Áo Tấc là lễ phục, hạn chế đi sneaker thể thao hầm hố khi dự lễ
  if (costume.id === 'ao_tac' && footwear.id === 'sneaker_trang' && selectedEventId === 'thuyet_trinh') {
    violations.push({
      level: 'caution',
      title: 'Nên cân nhắc bối cảnh học thuật & lễ nghi',
      message: 'Áo Tấc là đại lễ phục mang tính tôn kính. Khi tham gia sự kiện thuyết trình hoặc tốt nghiệp, một đôi giày da Oxford hoặc guốc mộc sẽ chỉn chu và đúng chuẩn mực hơn giày thể thao.',
      recommendation: 'Giữ sneaker cho dịp chụp kỷ yếu dạo phố, còn thuyết trình nên chọn giày Oxford hoặc Loafer.'
    });
  }

  // Quy tắc 3: Râu ông nọ cắm cằm bà kia (Phụ kiện Bắc Bộ phối trang phục Nam Bộ / Trung Bộ)
  const hasQuaiThao = accessories.some((a) => a.id === 'non_quai_thao');
  if (costume.id === 'ao_ba_ba' && hasQuaiThao) {
    violations.push({
      level: 'warning',
      title: 'Lệch đặc trưng vùng miền văn hóa',
      message: 'Áo Bà ba là linh hồn phóng khoáng của sông nước Nam Bộ, trong khi Nón quai thao lại là biểu trưng đặc thù của liền chị Quan họ Kinh Bắc. Sự kết hợp này dễ gây hiểu lầm sai lệch về nguồn gốc địa lý.',
      recommendation: 'Bạn nên đổi sang Nón lá chóp tre hoặc khăn rằn Nam Bộ.'
    });
  }

  // Quy tắc 4: Khăn vành dây cung đình Huế chỉ dành cho Nhật bình hoặc đại lễ phục
  const hasKhanVanhDay = accessories.some((a) => a.id === 'khan_vanh_day');
  if (hasKhanVanhDay && costume.id !== 'ao_nhat_binh' && costume.id !== 'ao_tac') {
    violations.push({
      level: 'caution',
      title: 'Khăn vành dây là phụ kiện cung đình cao cấp',
      message: `Khăn vành dây thời xưa chỉ dùng cho hoàng thân quốc thích hoặc cô dâu mặc Nhật bình/Áo Tấc. Khi phối cùng ${costume.name}, bạn có thể tạo cảm giác trang phục sân khấu hóa quá đà.`,
      recommendation: 'Nên đổi sang khăn vấn thông thường hoặc để tóc buông tự nhiên.'
    });
  }

  // Quy tắc 5: Áo Tứ thân truyền thống phối quần âu
  if (costume.id === 'ao_tu_than' && bottom.id === 'quan_au_suong') {
    violations.push({
      level: 'caution',
      title: 'Nên cân nhắc phom dáng tà áo',
      message: 'Áo Tứ thân có vạt buộc trước, khi mặc cùng quần âu hiện đại có thể làm gãy nếp tà áo. Phom váy đụp đen hoặc chân váy dài suông sẽ giữ được trọn vẹn nét mềm mại dân gian.',
      recommendation: 'Thử chuyển sang Váy đụp đen hoặc Chân váy dài xếp ly.'
    });
  }

  // Quy tắc 7: Áo dài tân thời và quần quá ngắn
  if (costume.id === 'ao_dai_tan_thoi' && bottom.id === 'vay_dup_den') {
    violations.push({
      level: 'caution',
      title: 'Cân nhắc độ dài và phom dáng',
      message: 'Áo dài tân thời đi cùng váy đụp là một trào lưu từng gây tranh cãi nếu váy quá ngắn. Nên ưu tiên quần lụa suông dài để giữ nét thanh thoát uyển chuyển.',
      recommendation: 'Thử đổi sang Quần lụa trắng hoặc Quần âu xếp ly suông.'
    });
  }

  // Quy tắc 8: Áo Giao Lĩnh cần làm rõ để tránh nhầm với cổ trang nước ngoài
  if (costume.id === 'ao_giao_linh') {
    violations.push({
      level: 'tip',
      title: 'Nét riêng Đại Việt (Lý - Trần - Lê)',
      message: 'Giao lĩnh Đại Việt đặc trưng với chất liệu the mỏng mát khí hậu nhiệt đới, kết hợp hoa văn thời Lý-Trần (hoa sen, lá đề). Tuyệt đối giữ vạt TRÁI đè vạt PHẢI!'
    });
  }

  // Quy tắc 6: Mẹo tích cực (Level 1: Gợi ý nhẹ)
  if (costume.id === 'ngu_than_tay_chen') {
    violations.push({
      level: 'tip',
      title: 'Mẹo diện Ngũ thân đúng điệu',
      message: 'Cài khuy đủ 5 cúc bên nách phải và để lộ nhẹ viền trắng của cổ áo lót bên trong (cổ lập lĩnh) sẽ giúp khuôn mặt bạn sáng bừng và cực kỳ đúng chuẩn cổ nhân!'
    });
  }

  return violations;
}

export interface ColorHarmonyEvaluation {
  score: number;
  principle: 'tuong_dong' | 'tuong_phan' | 'bo_sung' | 'trung_tinh';
  principleLabel: string;
  verdict: string;
  explanation: string;
  traditionalPrecedent?: string;
  recommendation: string;
}

/**
 * Đánh giá độ hài hòa màu sắc dựa trên Bánh xe màu (Tương phản, Tương đồng, Bổ sung)
 * và Tiền lệ lịch sử trang phục truyền thống Việt Nam
 */
export function evaluateColorHarmony(
  primaryColor: ColorOption,
  bottomPiece: ClothingPiece,
  costume: CostumeItem
): ColorHarmonyEvaluation {
  const pId = primaryColor.id;
  const bId = bottomPiece.id;

  // 1. Tiền lệ: Đen Huyền + Đỏ Son (The đen lót son thời Nguyễn)
  if ((pId === 'den_huyen' && bId === 'quan_lua_trang') || (pId === 'do_son' && bId === 'quan_lua_den')) {
    return {
      score: 98,
      principle: 'tuong_phan',
      principleLabel: 'Màu Tương Phản (Contrast)',
      verdict: 'Tuyệt mỹ – Đậm chất The Đen lót Son',
      explanation: 'Sự đối lập đỉnh cao giữa sắc đen thâm trầm và đỏ son rực rỡ tạo chiều sâu quang học quý phái, vừa kín đáo vừa lộng lẫy.',
      traditionalPrecedent: 'Tiền lệ lịch sử: Lối mặc áo the đen lót gấm son bên trong của giới quý tộc triều Nguyễn, khi cử động sẽ ánh lên sắc đỏ kiêu sa.',
      recommendation: 'Giữ nguyên set đồ này, phối thêm guốc mộc quai nhung hoặc chuỗi hạt ngọc trai là chuẩn điểm 10.'
    };
  }

  // 2. Tiền lệ: Nâu Non + Váy Đụp Đen hoặc Đỏ Son (Áo Tứ thân & Yếm đào Kinh Bắc)
  if (pId === 'nau_non' && (bId === 'vay_dup_den' || bId === 'quan_lua_den')) {
    return {
      score: 96,
      principle: 'tuong_dong',
      principleLabel: 'Màu Tương Đồng Mộc Mạc',
      verdict: 'Hồn cốt dân gian Bắc Bộ',
      explanation: 'Sắc nâu non của củ củ bùn hòa nhịp êm ả cùng sắc đen tuyền của lụa the, toát lên vẻ đẹp tần tảo, đôn hậu và thanh khiết.',
      traditionalPrecedent: 'Tiền lệ lịch sử: Bộ trang phục lao động và trẩy hội mộc mạc của phụ nữ đồng bằng sông Hồng thế kỷ 18–19.',
      recommendation: 'Rất hợp khi điểm xuyết thêm một chiếc dải lưng điều (lụa đỏ) thắt nhẹ ngang eo.'
    };
  }

  // 3. Tiền lệ: Vàng Nghệ + Quần đen hoặc Quần trắng (Sắc gấm hoàng triều)
  if (pId === 'vang_nghe' && (bId === 'quan_lua_den' || bId === 'quan_lua_trang' || bId === 'quan_au_suong')) {
    return {
      score: 95,
      principle: 'tuong_phan',
      principleLabel: 'Tương Phản Quý Phái',
      verdict: 'Vương giả & Rạng rỡ',
      explanation: 'Sắc vàng nghệ hoàng kim ấm no (hành Thổ) nổi bật rực rỡ trên nền đen/trắng trung tính, gợi nhắc vẻ tôn nghiêm của lễ phục xưa.',
      traditionalPrecedent: 'Tiền lệ lịch sử: Phổ biến trong trang phục quan lại và các dịp đại lễ khánh tiết thời phong kiến.',
      recommendation: 'Nên phối cùng giày da Oxford hoặc guốc mộc để giữ phom dáng đĩnh đạc.'
    };
  }

  // 4. Tiền lệ: Đỏ Son + Men Lam (Màu Bổ Sung - Dải ngũ sắc Nhật bình)
  if ((pId === 'do_son' && bId === 'quan_jeans_denim') || (pId === 'men_lam' && bId === 'quan_au_suong')) {
    return {
      score: 92,
      principle: 'bo_sung',
      principleLabel: 'Màu Bổ Sung (Complementary)',
      verdict: 'Tương phản năng động – Hợp Gen Z',
      explanation: 'Cặp màu nóng (Đỏ son) và lạnh (Men lam / Xanh Denim) bổ trợ cho nhau tạo cảm giác thị giác cực kỳ bắt mắt và tràn đầy năng lượng thanh xuân.',
      traditionalPrecedent: 'Tiền lệ lịch sử: Quy tắc ngũ sắc (Thủy - Hỏa tương hòa) trên cổ và cửa tay áo Nhật bình triều Nguyễn.',
      recommendation: 'Cách phối rất hút mắt trên phố và trong ảnh kỷ yếu, giữ sneaker trắng để cân bằng tổng thể.'
    };
  }

  // 5. Tiền lệ: Chàm Thẫm + Quần Lụa Trắng (Cốt cách Nho nhã)
  if (pId === 'cham_dam' && (bId === 'quan_lua_trang' || bId === 'quan_au_suong')) {
    return {
      score: 97,
      principle: 'tuong_phan',
      principleLabel: 'Tương Phản Kinh Điển',
      verdict: 'Nho nhã & Chuẩn mực hàn lâm',
      explanation: 'Màu chàm thẫm đĩnh đạc kết hợp cùng sắc trắng tinh khiết tạo nên phong thái trí thức, điềm đạm và đài các.',
      traditionalPrecedent: 'Tiền lệ lịch sử: Lối phục sức tiêu chuẩn của giới sĩ tử, quan viên và học trò trường Quốc Tử Giám thời xưa.',
      recommendation: 'Lựa chọn số 1 cho các buổi thuyết trình đề tài văn hóa hoặc lễ trao bằng tốt nghiệp.'
    };
  }

  // 6. Tiền lệ: Hồng Sen + Quần Trắng / Quần Đen (Duyên dáng thiếu nữ)
  if (pId === 'hong_sen' && (bId === 'quan_lua_trang' || bId === 'quan_lua_den' || bId === 'chan_vay_xep_ly')) {
    return {
      score: 94,
      principle: 'tuong_dong',
      principleLabel: 'Màu Tương Đồng Mềm Mại',
      verdict: 'Thanh tân & Duyên dáng',
      explanation: 'Sắc hồng sen Tây Hồ tươi tắn mang vẻ đẹp xuân thì, rất mềm mại khi sánh đôi cùng quần lụa bay bổng.',
      traditionalPrecedent: 'Tiền lệ lịch sử: Áo dài tân thời nữ sinh thập niên 1950–1960 dạo phố xuân.',
      recommendation: 'Thêm một chuỗi hạt ngọc trai hoặc nón lá chóp tre sẽ tôn trọn nét thanh tao.'
    };
  }

  // 7. Quy tắc nền trung tính (Neutral Base)
  const isNeutralBottom = ['quan_lua_trang', 'quan_lua_den', 'quan_au_suong'].includes(bId);
  if (isNeutralBottom) {
    return {
      score: 90,
      principle: 'trung_tinh',
      principleLabel: 'Phối Nền Trung Tính (Neutral Anchor)',
      verdict: 'Thanh lịch & An toàn tuyệt đối',
      explanation: `Sắc ${primaryColor.name} được làm nổi bật tối đa nhờ hạ y màu trung tính (${bottomPiece.name}), tránh rối mắt và tạo sự tập trung vào phom áo.`,
      traditionalPrecedent: 'Tiền lệ lịch sử: Quy tắc nền lụa trắng/đen luôn là chuẩn mực bất biến của trang phục người Việt qua các triều đại.',
      recommendation: 'Dễ mặc trong mọi hoàn cảnh từ đi học đến đi tiệc.'
    };
  }

  // 8. Tương phản phá cách Streetwear Gen Z (Jeans hoặc Váy xếp ly)
  return {
    score: 87,
    principle: 'tuong_phan',
    principleLabel: 'Tương Phản Hiện Đại (Urban Edge)',
    verdict: 'Sáng tạo & Đậm cá tính',
    explanation: `Sự kết hợp giữa chất màu truyền thống ${primaryColor.name} và chất liệu hiện đại của ${bottomPiece.name} tạo nên bản phối 'Việt phục Remix' đúng chất Gen Z.`,
    traditionalPrecedent: 'Sáng tạo mới: Sự giao thoa của thời trang đường phố đương đại với phom dáng di sản.',
    recommendation: 'Giữ phụ kiện tối giản để set đồ không bị phân tán điểm nhấn.'
  };
}
