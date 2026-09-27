// Test syllabi offered on the page. The first two are the original built-in examples; the others are
// fictional syllabi written for this demo in the layout of Taiwanese university course systems
// (not copied from any real course). They were written after the rubric was frozen and are not used
// to tune rules. Real public syllabi are linked in REAL_SYLLABI; their text is copyrighted and not bundled.
import {ABILITIES} from './abilities.js';

export const SAMPLES = [
  {id: 'good', label: '完整范例', kind: '内建范例', title: '顾客关系管理与 AI 应用（餐旅系三年级）',
    text: ABILITIES.map(a => a.good).join('\n\n')},
  {id: 'bad', label: '空泛反例', kind: '内建范例', title: '顾客关系管理与 AI 应用（餐旅系三年级）',
    text: ABILITIES.map(a => a.bad).join('\n\n')},
  {id: 'writing', label: '通识写作', kind: '虚构・部分涵盖', title: 'AI 时代的阅读与写作（通识，大一国文）',
    text: `课程概述
本课程带领学生在生成式 AI 普及的情境下重新练习阅读、思辨与写作，培养负责任使用 AI 的态度与独立思考能力。

课程目标
1. 能说明生成式 AI 在写作上的用途与限制。
2. 能在作业中诚实揭露 AI 的使用情形。
3. 能独立完成一篇具个人观点的评论文章。

AI 使用规范
本课程允许使用 ChatGPT 等工具协助发想与修辞，但每份作业须附「AI 使用纪录」，写明使用的工具、提示词与采用的段落；未附纪录者该次作业不予计分。

课程进度
第 1 周：课程介绍、AI 与写作的关系
第 2–3 周：阅读单元一〈论说文的结构〉，学生分组拆解范文论点
第 4 周：学生请 AI 摘要同一篇文章，再逐段比对原文，标出 AI 漏掉或扭曲的论点，缴交比对表
第 5–7 周：阅读单元二〈报导文学〉
第 8 周：期中写作：学生到校园周边观察一个生活现象，自己拟定题目写 800 字观察短文，不得使用 AI 生成内文
第 9–12 周：阅读单元三〈科技与人文〉，课堂讨论 AI 对创作者工作的影响
第 13–16 周：期末评论文章撰写与同侪互评
第 17–18 周：弹性学习周

评量方式
平时作业（含 AI 使用纪录）30%
AI 摘要比对表 10%
期中观察短文 25%（依写作尺规评分）
期末评论文章 25%
课堂参与 10%`},
  {id: 'marketing', label: '行销研究', kind: '虚构・课程系统表格', title: '行销研究与 AI 资料分析（企管系三年级）',
    text: `课程概述 Course Description
本课程结合行销研究方法与 AI 分析工具，学生以真实企业资料完成一份市场研究报告。

课程学习目标 Course Objectives
能设计问卷与抽样计划
能运用 AI 工具分析质性与量化资料
能判读 AI 分析结果并提出行销建议

课程进度 Progress Description
周次	进度说明
1	课程介绍与分组，确认合作企业（在地连锁咖啡品牌）
2	行销研究流程与研究问题设定
3	次级资料搜集：学生比较 Perplexity、Google Scholar 与 NotebookLM 搜集产业资料的完整度与可信度，填写工具比较表
4	问卷设计与前测
5	抽样方法
6	资料搜集：各组至门市访谈 5 位顾客并回收 100 份问卷
7	AI 质性分析：学生用 ChatGPT 将访谈逐字稿归纳主题，再由两位组员人工编码 20% 资料，计算与 AI 归纳的一致率
8	期中报告：研究设计与初步发现
9	期中考周
10	量化分析（一）叙述统计
11	量化分析（二）回归分析，学生比较 AI 产生的程式码与自己撰写的分析结果是否一致
12	研究伦理：受访者个资去识别化练习，并撰写资料使用声明
13	人机分工检讨：各组绘制本专案的人机分工流程，标出 AI 出错的步骤与人工覆核方式
14	行销建议撰写：由各组自行决定提案方向，说明为何采纳或不采纳 AI 的建议
15	业师讲评与修正
16	期末成果发表（向合作企业简报）
17	期末报告缴交
18	弹性学习周

评量方式 Grading
方法	百分比%
工具比较表	10
质性分析与一致率报告	15
期中报告	20
期末报告与简报（依评分尺规，含业师评分）	40
课堂参与	15`},
  {id: 'manufacturing', label: '智慧制造', kind: '虚构・讲授为主', title: '智慧制造导论（工管系二年级）',
    text: `课程概述
工业 4.0 与人工智慧正深刻改变制造业。本课程介绍智慧制造的核心技术与产业趋势，培养学生具备 AI 时代所需的跨领域整合能力、创新思维与终身学习的态度，并了解 AI 带来的伦理与社会影响。

课程目标
1. 了解智慧制造与工业 4.0 的基本概念
2. 认识机器学习、物联网与数位孪生
3. 培养运用 AI 解决制造问题的能力
4. 建立 AI 伦理与资安意识

课程进度
1	课程介绍
2	工业 4.0 概论
3	物联网与感测技术
4	大数据与云端运算
5	机器学习概论（一）
6	机器学习概论（二）
7	生成式 AI 在制造业的应用
8	数位孪生
9	期中考
10	智慧工厂案例介绍
11	预测性维护
12	品质检测与电脑视觉
13	供应链与 AI
14	AI 伦理、资安与社会影响
15	产业趋势讲座
16	课程回顾
17	期末考
18	弹性学习周

评量方式
出席 20%
期中考 35%
期末考 35%
心得报告 10%`},
];

export const REAL_SYLLABI = [
  {school: '国立台湾大学', course: '生成式人工智慧导论（112-2）',
    url: 'https://nol.ntu.edu.tw/nol/coursesearch/print_table.php?course_id=921+U3570&class=&dpt_code=9210&ser_no=74774&semester=112-2'},
  {school: '国立成功大学／AI 联盟', course: '生成式AI：文字与图像生成的原理与实务（113-2）',
    url: 'https://class-qry.acad.ncku.edu.tw/syllabus/online_display_remote.php?class_code=&co_no=ZA50900&sem=2&syear=0113'},
  {school: '国立成功大学', course: '人工智慧与应用（113-1）',
    url: 'https://class-qry.acad.ncku.edu.tw/syllabus/online_display.php?class_code=&co_no=N063700&sem=1&syear=0113'},
];
