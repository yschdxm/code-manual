<div align="center">

# Code Manual Skill

给 AI 编程助手（Claude Code 等）的通用 Skill：一条命令生成**自更新的单文件 HTML 代码手册**——文件树 + 每文件「作用 + 已实现功能」+ 搜索 + 符号级源码懒加载高亮，改完代码重跑脚本即刷新，永不腐烂

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![最近提交](https://img.shields.io/github/last-commit/yschdxm/code-manual)](https://github.com/yschdxm/code-manual/commits/master)
[![Issues](https://img.shields.io/github/issues/yschdxm/code-manual)](https://github.com/yschdxm/code-manual/issues)
[![爱发电](https://img.shields.io/badge/%E7%88%B1%E5%8F%91%E7%94%B5-%E8%AF%B7%E6%88%91%E5%96%9D%E6%9D%AF%E5%A5%B6%E8%8C%B6-7e5fd9?logo=afdian&logoColor=white)](https://ifdian.net/a/yschdxm)

[English](README.en.md) · 中文

<a href="https://whale-star.whale-star.workers.dev/">
  <img src="https://whale-star.whale-star.workers.dev/?repo=yschdxm/code-manual" alt="给个 Star 吧～" width="720">
</a>

> 🐳 顶部应援图来自 **[whale-star](https://github.com/yschdxm/whale-star)**——
> 按 GitHub Star 数自动升档的大肥鱼 README 应援图服务，给自己的仓库也挂一条吧

</div>

## 这是什么

一个可安装到任意项目的 Agent Skill。安装后，对 AI 说一句「给这个项目做一个代码手册」，它就会：

1. 写一个**幂等的生成脚本**（`tool/gen_code_manual.py`），从源码文件头注释抽取「这个文件是什么」，从顶层符号抽取「实现了什么功能」
2. 生成**单文件 HTML**（`CODE-MANUAL.html`，仓库根目录）：左侧多级可展开文件树、顶部搜索（命中自动展开祖先目录）、右侧详情面板
3. 每个符号下方有「代码 ▾」开关——**按行区间动态加载源码并轻量高亮**（不嵌入手册本体，体积不随代码增长；`file://` 受限时降级为源文件直链）
4. 把「改完代码必须重跑脚本、手册随代码一并提交」的纪律**三重固化**：脚本 docstring + 项目指令文件（CLAUDE.md/AGENTS.md）+ 持久记忆

流程提炼自 StoryForge 项目的真实实践（含安全审查闭环：JSON 内嵌转义防 `</script>` 注入、所有 HTML 插值走 `esc()`）。

## 特点

- **单文件、离线可用**：双击即开，无外部依赖、无需服务器
- **源码零嵌入**：手册只存行区间指针，源码按需动态加载
- **中英双语**：默认中文（`SKILL.md` + 模板 `UI_LANG="zh"`），英文副本 `SKILL.en.md`（安装时重命名为标准 `SKILL.md`）
- **语言无关**：内置 Python（ast）扫描器，其他语言换扫描器即可（模板注释含 Dart 先例）
- **安全**：源码注释无法通过手册注入脚本（JSON `<` 转义 + 全插值 `esc()`）

## 安装（给 Agent 的命令）

本仓库与通常项目不同：**默认是中文版，英文是副本**。安装时选择语言，并把所选文件**重命名为标准格式 `SKILL.md`**。

### 中文版（默认）

```bash
git clone --depth 1 https://github.com/yschdxm/code-manual.git /tmp/code-manual-skill
mkdir -p ~/.claude/skills/code-manual
cp /tmp/code-manual-skill/SKILL.md ~/.claude/skills/code-manual/SKILL.md
cp /tmp/code-manual-skill/template.py ~/.claude/skills/code-manual/template.py
rm -rf /tmp/code-manual-skill
```

### English version

```bash
git clone --depth 1 https://github.com/yschdxm/code-manual.git /tmp/code-manual-skill
mkdir -p ~/.claude/skills/code-manual
cp /tmp/code-manual-skill/SKILL.en.md ~/.claude/skills/code-manual/SKILL.md   # rename to standard SKILL.md
cp /tmp/code-manual-skill/template.py ~/.claude/skills/code-manual/template.py
rm -rf /tmp/code-manual-skill
```

安装英文版后，把模板适配到项目时记得设 `UI_LANG = "en"`，生成的手册界面即为英文。

Windows（PowerShell）等价命令：

```powershell
git clone --depth 1 https://github.com/yschdxm/code-manual.git $env:TEMP\code-manual-skill
New-Item -ItemType Directory -Force ~/.claude/skills/code-manual | Out-Null
Copy-Item $env:TEMP\code-manual-skill\SKILL.md     ~/.claude/skills/code-manual\SKILL.md     # 中文版;英文版改拷 SKILL.en.md
Copy-Item $env:TEMP\code-manual-skill\template.py  ~/.claude\skills\code-manual\template.py
Remove-Item $env:TEMP\code-manual-skill -Recurse -Force
```

安装到项目级（仅当前项目生效）时，把 `~/.claude/skills/code-manual/` 换成 `<项目>/.claude/skills/code-manual/` 即可。

## 使用

安装后，在任意项目里说：

> 给这个项目做一个代码手册 / Create a code manual for this project

Skill 会自动完成全部七阶段流程（建生成器 → 抽样验证 → 查 gitignore → 三重纪律固化 → 提交 → 安全自查 → UX 基线）。之后每次改完代码，AI 会按纪律重跑：

```bash
python tool/gen_code_manual.py
```

## 手册长什么样

- **左侧**：多级可展开文件树（默认展开一级），文件名旁标行数
- **顶部**：搜索框，按文件名 / 路径 / 注释 / 符号名过滤，命中自动展开祖先目录，清空恢复
- **右侧**：选中文件后显示「这个文件是什么」（文件头注释）与「当前实现的功能」（全部顶层符号 + 各自一句话）
- **符号下方**：「代码 ▾」懒加载该符号的源码行区间，关键字/字符串/注释/数字着色
- **滚动条**等细节与深色主题一致

## 仓库结构

```
code-manual/
├── SKILL.md          # 中文版 Skill(默认)
├── SKILL.en.md       # English skill (copy; rename to SKILL.md on install)
├── template.py       # 双语生成器模板(HTML shell + Python ast 扫描器 + UI_LANG)
├── README.md         # 本文件(中文)
├── README.en.md      # English readme
├── LICENSE           # MIT
└── .github/assets/   # 赞助收款码
```

## 开发与测试

模板经过双语自检（对迷你 fixture 实际生成中英两版，断言 JSON 转义、src/ln 契约、懒加载与滚动条样式齐全）；自检脚本与 fixture 位于本地开发目录，不随仓库发布。

## 💝 支持开发

本 Skill 完全免费、开源（MIT）。如果它为你的项目省了时间，欢迎通过下面任意一种方式请作者喝杯咖啡——你的每一份支持都会化作后续的功能更新与问题修复：

<div align="center">

<a href="https://ifdian.net/a/yschdxm"><img width="200" src="https://pic1.afdiancdn.com/static/img/welcome/button-sponsorme.png" alt="在爱发电支持我"></a>

| 支付宝 | 微信支付 |
|:---:|:---:|
| <img src="./.github/assets/alipay.png" alt="支付宝收款码" height="340"> | <img src="./.github/assets/wechat-pay.png" alt="微信支付收款码" height="340"> |

*不方便扫码？也欢迎在 [爱发电](https://ifdian.net/a/yschdxm) 上支持，那里可以留下你想看的功能需求。*

</div>

## License

[MIT](LICENSE) © yschdxm
