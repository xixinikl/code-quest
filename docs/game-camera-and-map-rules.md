# 游戏镜头与关卡地图规则

## 目标

每个地点必须先让玩家知道“我到了哪里、谁在等我、这一关要追什么”，再展开教学内容。不同关卡不能只替换背景图，必须同时改变空间构图、镜头进入方式和证据地图拓扑。

## 场景契约

每个新场景至少声明以下内容：

- `scene`：能辨认地点功能的实景背景，不使用模糊装饰图冒充场景。
- `cameraVariant`：进入地点时的镜头。走廊适合横向推轨，工坊适合俯视落镜，对话适合角色切镜，地图适合稳定全景。
- `mapVariant`：与任务思维一致的地图。数据传递用线性接力，产品取舍用工作台分支，排障用证据汇合，探索用区域节点。
- `mentor`：角色站位不能遮挡任务标题、主操作或证据地图。
- `focus`：首屏只保留当前目标、当前角色和一个主操作；下一地点需要露出提示，但不与当前任务争抢注意力。

## 运镜规则

1. 地点进入使用 600–1000ms 的位置、缩放与透明度组合，让玩家感到“走进”空间。
2. 对话双方切换视角时使用短切或轻微平滑过渡，不让整页布局跳动。
3. 从剧情进入操作时，镜头落到任务物或地图；从操作返回地图时，恢复稳定全景。
4. 尊重 `prefers-reduced-motion`，关闭非必要位移和缩放。
5. 动画结束后的内容位置必须稳定，按钮不能因文字、角色或加载状态发生位移。
6. 每章必须声明自己的镜头时长和过渡曲线。性能章可以用较慢的线性下潜表现等待，接口审判章适合更短、更硬的推进，终章用较长的全景收束；禁止十五章共用同一段 `20s ease`。

## 地图规则

- 线性证据链：用于“谁把什么交给谁”，节点从左到右接力。
- 工坊桌面：用于需求拆解和候选取舍，前三个输入节点汇入后两个决定节点。
- 汇合排障图：用于多个证据共同指向一个断点，不能伪装成普通步骤条。
- 世界地图：用于地点选择和进度回看，显示空间关系，不塞入完整教学正文。
- 每张章节地图必须有可命名的“地貌”和“关键地标”。玩家再次看到地图时，应能用“时间瀑布峡谷 / 首字节钟塔”一类空间记忆定位，而不只是记住第几个步骤。
- 不同拓扑同时改变节点轮廓、路径虚线节奏和底图纹理。颜色只是辅助，不能成为区分地图的唯一手段。

## 当前落地

- 第 1 章延迟复测：记忆回声廊，横向推轨镜头，线性证据链。
- 第 2 章延迟复测：需求回声工坊，俯视落镜，工坊桌面地图。
- 第 3 章延迟复测：夜航身份中转站，检查点跟拍镜头，会话回环地图。
- 第 4 章延迟复测：信号风暴调度塔，告警下潜镜头，跨层故障分流图。
- 第 5 章延迟复测：双星索引井，双轨环绕镜头，两名 Worker 上下分流后汇入唯一索引库。
- 第 6 章延迟复测：晨星时序港，沿时间线滑行镜头，五段耗时由左上向右下形成瀑布，模型首字瓶颈占据视觉中心。
- 主线 1–15 的统一事实源是 `src/chapterCinematics.ts`。每章都有专属 `cameraLabel`、背景焦点、三段地点景别、地图名称、地图说明和拓扑，剧情不得退回全章节共用的漂移动画。
- 十五张主线地图分别为：数据接力线、产品取舍工作台、会话回环、接口故障树、一致性汇流图、性能瀑布、密钥安全门、引用镜面、RAG 检索迷宫、权限高塔、证据并行道、委托锻造台、交付审查菱形、上线闸门、职业证据星图。
- 每章进一步声明独立地貌、关键地标、强调色、背景纹理、节点轮廓、路径节奏、镜头时长和镜头曲线；这些字段集中在 `src/chapterCinematics.ts`，教学页不得另写一份分叉配置。
- 地图节点位置由拓扑声明，连线来自 `projectMap.edges` 的真实流程关系；第 13 章已把 Diff 与测试证据改为真实分流并在边界审查汇合，不能只画成菱形却继续使用线性数据。
- 桌面端用十二列空间地图表达分支、回环、汇合和层级；`720px` 以下关闭空间连线并按教学顺序回落为单列，避免手机上缩小成看不清的流程图。
- 2026-07-14 浏览器抽检产品取舍工作台、RAG 检索迷宫和交付审查菱形：1280px 与 390px 均无横向溢出，控制台无错误；这只证明界面与流程可用，不代表真人已理解。

## 参考

- [Unity Cinemachine 虚拟机位混合](https://docs.unity3d.com/Packages/com.unity.cinemachine@2.6/manual/CinemachineBlending.html)：镜头混合是位置、旋转和镜头状态的插值，并允许针对特定机位组合设置曲线与时长。项目据此把时长和 easing 放进章节契约，而不是全局写死。
- [Unreal Engine Camera Cut Track](https://dev.epicgames.com/documentation/en-us/unreal-engine/cinematic-camera-cut-track-in-unreal-engine)：剧情序列由多个 shot 划分焦点，并可在不同 Cine Camera 或剧情/游戏镜头之间切换和混合。项目据此保持每章三段景别序列。
- [Unreal Engine Camera Movement and Framing](https://dev.epicgames.com/documentation/en-us/fortnite/making-cinematics-3-camera-movement-and-framing-in-unreal-editor-for-fortnite)：摇摄、推轨、升降和跟拍承担不同的叙事职责，镜头应揭示地点、聚焦关键信息并推动故事。项目据此要求镜头变化必须对应学习任务，而不是装饰动画。
- [Ubisoft Level Design](https://www.ubisoft.com/en-us/company/careers/our-jobs/design/level-design)：关卡需要有目的地组织空间、障碍、活动、流动与节奏。项目据此把章节地图从步骤列表升级为有地标和路线差异的空间结构。
- [GDC《Procedural Level Design in Eldritch》](https://media.gdcvault.com/gdc2015/presentations/Pittman_David_Procedural%20Level%20Design.pdf)：迷宫结构需要可记忆的视觉地标，帮助玩家区分地图区域。项目据此为十五章分别加入地貌和关键地标。
- [Epic Level Design Best Practices](https://dev.epicgames.com/documentation/fortnite/level-design-best-practices-in-fortnite-creative)：路线应一眼可读，地点需要可辨认地标，环境叙事要随区域主题变化。项目据此要求每关的路线拓扑本身表达知识关系。
- [GDC《Stop Getting Lost: Make Cognitive Maps, Not Levels》](https://www.gdcvault.com/play/1027206/Stop-Getting-Lost-Make-Cognitive)：关卡应帮助玩家形成可记忆的认知地图，避免无意义迷路。项目据此让关卡地点、冲突点和出口在首屏建立空间关系。

上述资料用于提炼镜头与辨路原则，不复制任何具体游戏的美术、布局或组件。
