<div align="center">

# Code Manual Skill

给 AI 编程助手的通用 Skill：从源码注释生成**自更新的 HTML 代码手册**——文件树 + 每文件「作用/功能」+ 搜索 + 完整源码高亮，双击直开无需服务器，改完代码重跑脚本即刷新

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

## 描述

- **是什么**：一个可安装到 Claude Code 等 Agent 的 Skill。安装后对 AI 说一句「给这个项目做一个代码手册」，它就写好幂等生成脚本、产出双击直开的手册（HTML + 旁路源码数据两个文件）、并把「改完代码必须重跑」的纪律固化进项目
- **解决什么问题**：手写文档必然腐烂——代码改了文档没改，比没有文档更误导；这个 Skill 把手册变成**构建产物**，随代码一键再生成

## 快速开始

把下面这段提示词复制给你的 AI 编程助手（中文版，本仓库默认），它会自己完成安装：

```text
请帮我安装「Code Manual」skill：优先运行 npx -y code-manual-skill@latest（只装当前项目就加 --project）；如果 npx 不可用，就克隆 https://github.com/yschdxm/code-manual，把仓库根的 SKILL.md 和 template.py 复制到 ~/.claude/skills/code-manual/（项目级安装放 <项目根>/.claude/skills/code-manual/）。装完向我确认安装路径。
```

要装英文版，用 [English README](README.en.md) 里的提示词。

### 手动安装（备选）

也可以自己跑命令，以后**升级 = 重跑同一条命令**（`@latest` 每次取最新版并覆盖旧副本）：

```bash
npx -y code-manual-skill@latest             # 中文版(默认) → ~/.claude/skills/code-manual/
npx -y code-manual-skill@latest --lang en   # 英文版(SKILL.en.md 重命名为 SKILL.md)
npx -y code-manual-skill@latest --project   # 只装到当前项目 → ./.claude/skills/code-manual/
```

常驻安装用 `npm i -g code-manual-skill`，升级时 `npm update -g code-manual-skill && code-manual-skill`。安装只需 Node 18+，不需要 Python（Python 只在目标项目生成手册时用到）。

装完重启会话，确认技能列表出现 `code-manual`，然后在任意项目里说：

```text
给这个项目做一个代码手册
```

## 技术要点

- **Skill 格式**：YAML frontmatter（`name` + 触发式 `description`）+ Markdown 流程正文
- **生成器**：Python 3 标准库（`ast` 解析 docstring、`json` 内嵌数据、`pathlib` 扫描），无第三方依赖
- **手册前端**：HTML/CSS/JS——多级树、搜索联动、详情页直接展示完整源码并高亮；源码经旁路 `CODE-MANUAL.sources.js` 以 `<script src>` 动态链接，`file://` 双击直开、无需服务器
- **安全**：内嵌 JSON 先转义 `<`（防 `</script>` 提前闭合），所有 HTML 插值统一走 `esc()`

## 架构（概述）

Skill 文档层（指导 Agent 执行七阶段流程）与 `template.py` 生成器层（扫描源码 → 注入转义 JSON + 旁路源码数据 → 渲染手册）分离；完整源码由旁路 `.sources.js` 动态链接，HTML 本体保持轻量。

## 项目结构

```
code-manual/
├── package.json      # npm 包 code-manual-skill
├── bin/install.mjs   # npx 安装器(零依赖,支持 --lang / --project)
├── SKILL.md          # 中文版 Skill(默认)
├── SKILL.en.md       # 英文副本(安装时重命名为 SKILL.md)
├── template.py       # 双语生成器模板
├── README.md         # 本文件
├── README.en.md      # 英文版 README
├── LICENSE           # MIT
├── .github/workflows # push tag 自动发 npm + Release
└── .github/assets/   # 赞助收款码
```

---

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
