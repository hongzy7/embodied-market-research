const VERIFIED = "2026-09-16";
const product = (id, company, series, group, payload, reach, weight, repeatability, speed, sensing, stack, applications, source, extras = {}) => ({
  id, company, series, group, payload, reach, weight, repeatability, speed, sensing, stack, applications, source,
  verified: VERIFIED, priority: extras.priority || (group === "华沿基线" ? "BASE" : group === "直接竞品" ? "P0" : "P1"),
  form: extras.form || "轻量单臂 / 可组成双臂", country: extras.country || "中国",
  delivery: extras.delivery || "未检索到该型号可核验的公开订单、交付量或成交价。",
  dataStatus: extras.dataStatus || "核心硬参数完整",
  evidenceNote: extras.evidenceNote || "硬参数已按厂商官方产品页或技术手册核验；商业数据仅记录公开披露。",
});

const huayan = "https://www.huayan-robotics.com/humanoid-arm";
const rokae = "https://www.rokae.com/cn/news/show/2447/%E7%8F%9E%E7%9F%B3%E6%9C%BA%E5%99%A8%E4%BA%BA%E5%8F%91%E5%B8%83%E6%96%B0%E6%AC%BEAR%E4%BA%BA%E5%BD%A2%E5%8A%9B%E6%8E%A7%E8%87%82-%E7%A1%AC%E6%A0%B8%E5%8A%9B%E6%8E%A7%E8%B5%8B%E8%83%BD%E5%85%B7%E8%BA%AB%E6%99%BA%E8%83%BD%E4%BA%A7%E4%B8%9A%E5%8C%96.html";
const hySense = "全关节扭矩传感器与抱闸；末端接触力精度0.1 N；力控带宽≥100 Hz";
const hyStack = "EtherCAT；末端RS485 / EtherCAT；原生ROS 2 / SDK；单控制器最多支持4条手臂";
const arSense = "全关节扭矩传感器标配；末端六维力传感器可选";
const arStack = "EtherCAT / CAN FD / RS485；ROS 2；开放动力学、阻抗与力位混合控制";

export const armProducts = [
  product("Echo 3","华沿机器人","Echo","华沿基线",3,555,8,"±0.02 mm","TCP≥2 m/s",hySense,hyStack,["具身数据采集","轻量操作","双臂集成"],huayan,{form:"共面十字交叉腕",priority:"BASE"}),
  product("Echo 5","华沿机器人","Echo","华沿基线",5,605,12,"±0.03 mm","TCP≥2 m/s",hySense,hyStack,["具身数据采集","精细操作","双臂集成"],huayan,{form:"共面十字交叉腕",priority:"BASE"}),
  product("Echo 15","华沿机器人","Echo","华沿基线",15,850,22,"±0.05 mm","TCP≥2 m/s",hySense,hyStack,["具身重载","工业操作","双臂集成"],huayan,{form:"共面十字交叉腕",priority:"BASE"}),
  product("HY 3","华沿机器人","HY","华沿基线",3.5,625,8,"±0.02 mm","TCP≥2 m/s",hySense,hyStack,["人形上肢","精细操作","双臂集成"],huayan,{form:"异面十字交叉腕",priority:"BASE"}),
  product("HY 7","华沿机器人","HY","华沿基线",7,670,12,"±0.03 mm","TCP≥2 m/s",hySense,hyStack,["人形上肢","柔性装配","双臂集成"],huayan,{form:"异面十字交叉腕",priority:"BASE"}),
  product("HY 15","华沿机器人","HY","华沿基线",15,850,22,"±0.05 mm","TCP≥2 m/s",hySense,hyStack,["人形上肢","具身重载","双臂集成"],huayan,{form:"异面十字交叉腕",priority:"BASE"}),
  ...[["AR3",3,650,7],["AR5",5,683,10],["AR10",10,760,18]].map(([id,p,r,w])=>product(id,"珞石机器人","AR","直接竞品",p,r,w,"±0.1 mm","TCP≥2 m/s",arSense,arStack,["工业数采","精密执行","轮式双臂"],rokae,{delivery:"AR系列厂商称累计出货突破3,000台；未披露分型号数量与成交价。"})),
  product("ART7-R7","法奥意威","ART7","直接竞品",7,714,15,"±0.03 mm","关节≥150°/s","公开手册未确认关节扭矩传感器配置","提供单臂、双臂与控制器配置",["人形双臂集成","柔性装配","科研开发"],"https://fairino-art-doc.readthedocs.io/zh-cn/latest/ART7Manual/art_product.html"),
  product("AIRBOT P7","求之科技","AIRBOT","直接竞品",3,640,5,"±0.1 mm","官方未披露最大速度","J1–J4机械抱闸、J5–J7软抱闸；支持位置/力矩/速度控制","CAN FD / TCP；ROS 2；Python / C++；10 TOPS",["具身智能研发","数据采集","人形上肢"],"https://www.discover-robotics.com/products/airbot-p7",{dataStatus:"部分披露：最大速度未公布",evidenceNote:"已核验P7产品页与SDK文档；支持速度控制，但官方未公布最大关节/TCP速度。"}),
  product("MAXHUB D3","视源股份 / MAXHUB","D","直接竞品",3,660,null,"官方未披露","最高10 m/s（厂商口径）","准直驱、力矩透明、支持外力估计；多模态时间同步","6 TOPS；C++ / Python / ROS 1/2；MuJoCo；π0 / ACT；MIT跟随≤20 ms",["电柜操作","工业/物流分拣","门店理货","数采"],"https://www.cvte.com/news/detail/21b012e0-acc8-11f1-a10f-b14ef11e5164",{form:"七轴仿人形双臂",delivery:"与南京天创机器人T-WAVES完成电柜操作联合验证；未披露订单与交付量。",dataStatus:"部分披露：单臂自重、重复定位精度未公布",evidenceNote:"已核验D3官方发布及WRC 2026资料；A3的5.5 kg/±0.1 mm参数不外推给D3。"}),
  product("NERO","松灵机器人","NERO","直接竞品",3,580,4.8,"±0.1 mm","关节180–225°/s","碰撞保护；未见关节扭矩传感器公开声明","CAN / TCP / HTTP；Python SDK；ROS 1/2",["具身AI研发","高校实验室","移动操作"],"https://global.agilex.ai/products/nero",{delivery:"海外官网公开标价US$2,499；未披露订单或交付量。"}),
  product("RIZON 4","非夕科技","RIZON","邻近竞品",4,876,20,"±0.05 mm","TCP 1 m/s","全关节力矩感知；力感知精度0.1 N","Flexiv Elements / RDK；支持力控与自适应",["自适应装配","具身研究","工业操作"],"https://flexiv.cn/product/rizon",{delivery:"官方案例：水产食品鱼排整形、新能源车自动充电、百叶窗柔性打磨；未披露订单金额或交付量。"}),
  product("RIZON 10","非夕科技","RIZON","邻近竞品",10,941,38,"±0.05 mm","TCP 1 m/s","全关节力矩感知；力感知精度0.2 N","Flexiv Elements / RDK；支持力控与自适应",["自适应装配","重载操作","AICO双臂平台"],"https://flexiv.cn/product/rizon",{delivery:"官方案例：汽车电机悬置装配，与RIZON 4协同实现99.5%以上成功率、60 s节拍；未披露订单金额。"}),
  product("ENLIGHT L","非夕科技","ENLIGHT","直接竞品",5,752,15,"±0.05 mm（ISO 9283）","标准末端线速度 1.0 m/s","力感知精度0.1 N；最大可控力400 N","Flexiv Elements；ORION / RCM；16 DI/DO、2 AI/AO",["紧凑工业产线","近距离人机交互","狭窄与受限空间","多臂协同"],"https://www.flexiv.cn/product/enlight",{form:"轻量仿人单臂 / 支持多臂协同",delivery:"官网未披露订单金额、客户名称或批量交付数量。",evidenceNote:"采用非夕官网ENLIGHT L参数；官网臂展752 mm按本表工作半径口径录入。"}),
  product("Diana 7","Agile Robots","Diana","邻近竞品",7,923,26,"±0.05 mm","TCP 1 m/s","全关节扭矩传感器；力控精度0.5 N","AgileCore；C++ / Python",["汽车","3C电子","具身研究"],"https://www.agile-robots.com/en/products/diana-7/",{country:"德国"}),
  product("RM75","睿尔曼","RM","直接竞品",5,610,7.8,"±0.05 mm","TCP≤1.8 m/s","标准版/内置六维力版；六维力200 N / 7 Nm","一体化控制器；ROS / SDK",["人形双臂","轮式操作","科研教育"],"https://www.realman-robotics.cn/cn/products/rm75.html",{form:"标准版 / 六维力版"}),
  product("RX75","睿尔曼","RX","直接竞品",5,709,8.2,"±0.2 mm","TCP≤2.2 m/s","内置六维力传感器200 N / 7 Nm","面向侧挂双臂优化；ROS / SDK",["RealBot轮式双臂","具身数采","商业服务"],"https://www.edge.realman-robotics.cn/cn/products/rx75.html",{form:"标准 / 视觉 / RX75S版本"}),
  product("GEN72-B","睿尔曼","GEN","直接竞品",2,600,6.6,"±1 mm","TCP≤1.8 m/s","轻量仿人结构；典型功耗≤100 W","一体化控制器；ROS / SDK",["人形机器人本体","轻量操作","科研教育"],"https://develop.realman-robotics.com/robot/robotParameter/GEN72OntologyParameters.html"),
  ...[["LITEARM SE",3,664,5.4,"共面十字腕"],["LITEARM S",3,664,5.4,"共面十字腕"],["LITEARM SL",2,760,5.6,"共面十字腕"],["LITEARM P",3,650,5.4,"仿人腕"],["LITEARM PL",2,781,5.6,"仿人腕"]].map(([id,p,r,w,form])=>product(id,"新元体机器人","LITEARM","直接竞品",p,r,w,"±0.1 mm","关节180–225°/s","碰撞检测；未见全关节扭矩传感器公开声明","CAN FD / CAN / HTTP / TCP / RS485；Python / C++；ROS 1/2；MuJoCo",["人形上肢","遥操作数采","科研开发"],"https://nexform.tech/litearm",{form})),
  ...[["BR-R73P",3,688,8.5,"异构腕"],["BR-R73S",3,695,8.5,"十字腕"],["BR-R76S",6,745,12,"十字腕"],["BR-R712S",12,850,19,"十字腕"]].map(([id,p,r,w,form])=>product(id,"杜科机器人","BR","直接竞品",p,r,w,"±0.05 mm",p>=6?"TCP≤2.5 m/s":"TCP≤2 m/s","全关节扭矩传感器标配","EtherCAT 1 ms；Python / C++ / ROS 2",["人形上肢","数据工厂","工业操作"],"https://www.ducorobots.cn/prodetail/49.html",{form})),
  product("Linker Arm P7","灵心巧手","Linker Arm","直接竞品",3,608,5.6,"±0.043 mm","关节最高100 rpm（600°/s）","碰撞检测与安全停机","CAN / CAN FD；48 V",["具身智能","人形上肢","轻量操作"],"https://linkerhand.cn/details/LinkerArm/"),
  product("Mercury A1","大象机器人","Mercury","研究基准",1,450,5.2,"±0.05 mm","各关节最高150°/s","关节抱闸","CAN / Wi-Fi / 网络 / 蓝牙 / USB串口",["高校科研","教育实训","算法验证"],"https://docs.elephantrobotics.com/docs/Mercury_A1_en/2-ProductFeature/2.1-MachineSpecification.html",{priority:"P2"}),
  product("Franka Research 3","Franka Robotics","Franka","研究基准",3,855,18.3,"<±0.1 mm（ISO 9283）","TCP≤2 m/s；J1–J4 150°/s，J5–J7≤301°/s","全关节扭矩传感器；成熟力控生态","FCI / ROS 2 / libfranka",["具身研究","操作算法","力控实验"],"https://franka.de/hubfs/Datasheet%20Franka%20Research%203_R02212_2.4_EN.pdf?hsLang=en",{country:"德国",priority:"P2"}),
  product("Kinova Gen3 7DoF","Kinova","Gen3","研究基准",2,902,8.2,"官方2024规格页未披露","TCP 0.5 m/s","全关节力矩传感器","C++ / Python / ROS 1/2；1 kHz低层控制",["具身研究","移动操作","科研教育"],"https://www.kinovarobotics.com/uploads/Kinova_Onepager_Gen3_2024_EN.pdf",{country:"加拿大",priority:"P2",dataStatus:"部分披露：重复定位精度未公布",evidenceNote:"已核验Kinova 2024官方单页规格与用户指南，均未找到可归属该型号的重复定位精度数值。"}),
  product("xArm7","UFACTORY","xArm","研究基准",3.5,700,14.3,"±0.1 mm","TCP≤1 m/s","碰撞检测；未见全关节扭矩传感器标配","Python / C++ / ROS",["具身研究","教育实训","移动操作"],"https://docs.xarm.ufactory.cc/8.technical_specifications.html",{priority:"P2"}),
  product("Gento Luna","天机机器人","Gento","邻近竞品",6,null,null,"±0.03–0.05 mm（官网同页两处口径冲突）","官方未披露单臂最大速度","双臂与腰腿全身力控；自研关节传感器可感知0.02 N·m；柔顺阻抗控制","ROS 2 / SDK / API；Jetson Orin AGX 275 TOPS",["家庭服务","工业检测","商业服务","科研教育"],"https://cn.gentorobotics.ai/products/gento-luna/",{form:"轮式折叠双臂整机",delivery:"公司官网称已服务超1,000家客户、累计出货超30,000台，但该数字覆盖全产品，不能归因到Gento Luna。",dataStatus:"口径待厂商确认：精度±0.03/±0.05 mm；臂展、自重、速度未公布",evidenceNote:"官网同一页面的全身力控段落写±0.05 mm，手臂模块写±0.03 mm；其余三项未披露。"}),
  ...[
    ["Marvin M6S SRS-686",6,686,11.45,"±0.03 mm","TCP 2 m/s","传统协作构型；IP50"],
    ["Marvin M6S CCS-696",6,696,12,"±0.03 mm","TCP 2 m/s","十字交叉手腕；IP50"],
    ["Marvin M6S Lite CCS-615",5,615,8,"±0.03 mm","TCP 1.5 m/s","十字交叉手腕；IP50；J1–J4带抱闸"],
    ["Marvin M6S CCS-809",5,809,12.7,"±0.04 mm","TCP 2 m/s","十字交叉手腕；IP50"],
    ["Marvin M3S Long CCS-920",3,920,13.1,"±0.04 mm","TCP 2 m/s","十字交叉手腕；IP50"],
    ["Marvin M20S CCS-1050",20,1050,30,"±0.1 mm","TCP 2 m/s","十字交叉手腕；IP65"],
  ].map(([id,p,r,w,repeatability,speed,note])=>product(id,"天机智能","Marvin","直接竞品",p,r,w,repeatability,speed,"全关节标配扭矩传感器；作用力重复精度≤0.15 N、≤0.05 N·m；末端六维力传感器选配","EtherCAT≤1 ms；RS485 / CAN FD / EtherCAT；双绝对值编码器",["具身双臂","遥操作","精密装配","人机协作"],"https://www.tianjizn.com/products/marvin-series/",{form:"轻量7轴仿人单臂 / 可组全力控双臂",delivery:"官网未披露订单金额、客户名称或批量交付数量。",evidenceNote:`天机智能官网Marvin系列参数表；${note}；相机线可内置到末端。`})),
  ...[
    ["Marvin Pro+M3",3,615,"最大负载5 kg"],
    ["Marvin Pro+M6",6,695,"最大负载10 kg"],
  ].map(([id,p,r,maxPayload])=>product(id,"天机智能","Marvin Pro","直接竞品",p,r,null,"±0.03 mm","J1–J7最大180°/s","双臂标配全关节力控；作用力重复精度0.15 N；位置/阻抗/力位混合控制","1 kHz EtherCAT；ROS 2；Jetson Orin AGX 64G（275 TOPS）；HDF5 / RLDS；5目相机标配",["固定工位双臂","工业装配","科研实验","视觉与遥操作数采"],"https://www.tianjizn.com/products/marvin-pro/",{form:"固定式全力控仿人双臂（7DoF×2）",delivery:"官网未披露订单金额、客户名称或批量交付数量。",dataStatus:"核心硬参数基本完整：单臂自重未披露",evidenceNote:`${maxPayload}；整机14DoF、约80 kg、垂直工作空间0.6–1.8 m，支持24小时连续工作。`})),
];

export const armSignals = [
  {date:"2026-09-16",type:"产品",company:"天机智能 Marvin / Marvin Pro",title:"6款七轴仿人臂与2款固定式双臂配置纳入对比",detail:"Marvin覆盖3–20 kg额定负载与615–1050 mm工作半径；Marvin Pro提供M3/M6双臂配置、全关节力控、5目视觉与275 TOPS算力。",source:"https://www.tianjizn.com/products/marvin-series/"},
  {date:"2026-09-16",type:"产品",company:"非夕 ENLIGHT L",title:"轻量7轴仿人臂纳入直接竞品池",detail:"5 kg负载、752 mm臂展、15 kg自重、±0.05 mm重复定位精度，并支持多臂协同与受限空间操作。",source:"https://www.flexiv.cn/product/enlight"},
  {date:"2026-09-15",type:"落地",company:"非夕 RIZON 4 / 10",title:"官方案例补充量产与客户场景证据",detail:"RIZON 4已用于食品鱼排整形等场景；RIZON 4/10汽车悬置装配方案披露99.5%以上成功率、60 s节拍及进厂5天后量产。",source:"https://www.flexiv.cn/partner/case/Automobile_Motor_Mount_Assembly"},
  {date:"2026-08-13",type:"落地",company:"MAXHUB D3",title:"与T-WAVES完成电柜操作联合验证",detail:"覆盖电柜点按与配电柜旋钮旋拧；属于公开验证，不等同于批量成交。",source:armProducts.find(x=>x.id==="MAXHUB D3").source},
  {date:"2026-04-25",type:"产品",company:"华沿机器人",title:"Echo与HY系列形成3–15 kg产品矩阵",detail:"两种腕部构型覆盖具身数采、人形上肢与重载操作，并提供原生ROS 2与多臂控制。",source:huayan},
  {date:"2026-03-30",type:"交付",company:"珞石AR系列",title:"厂商称系列累计出货突破3,000台",detail:"公开信息未拆分AR3、AR5与AR10数量，不能作为单型号销量。",source:rokae},
  {date:"2026-09-14",type:"应用",company:"睿尔曼",title:"RealBot-01以双RX75进入轮式双臂场景",detail:"体现侧挂双臂、具身数采和服务操作的整机集成路径；未披露成交量。",source:"https://www.edge.realman-robotics.cn/cn/products/realbot-humanoid.html"},
  {date:"2026-09-14",type:"产品",company:"求之科技 AIRBOT P7",title:"轻量一体化7轴臂进入直接对标池",detail:"5 kg自重、3 kg负载、640 mm臂展，并集成10 TOPS算力与ROS 2开发栈。",source:"https://www.discover-robotics.com/products/airbot-p7"},
  {date:"2026-09-14",type:"应用",company:"非夕 AICO",title:"RIZON手臂被集成为双臂具身系统",detail:"AICO 2-4与2-10体现RIZON 4/10进入具身双臂研究与操作平台的路径。",source:"https://www.flexiv.cn/product/robot-system"},
];

export const armScope = "仅收录明确为7自由度、可独立采购或可作为双臂/人形上肢集成的产品型号；集成式双臂整机单独标注，传统6轴协作臂与未披露手臂自由度的整机不纳入。";
