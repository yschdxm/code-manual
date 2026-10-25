<div align="center">

# Code Manual Skill

给 AI 编程助手的通用 Skill：从源码注释生成**自更新的单文件 HTML 代码手册**——文件树 + 每文件「作用/功能」+ 搜索 + 符号级源码懒加载高亮，改完代码重跑脚本即刷新

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

- **是什么**：一个可安装到 Claude Code 等 Agent 的 Skill。安装后对 AI 说一句「给这个项目做一个代码手册」，它就写好幂等生成脚本、产出单文件手册、并把「改完代码必须重跑」的纪律固化进项目
- **解决什么问题**：手写文档必然腐烂——代码改了文档没改，比没有文档更误导；这个 Skill 把手册变成**构建产物**，随代码一键再生成

## 快速开始

把安装提示词复制给你的 AI 编程助手（中文版，本仓库默认）：

```text
请帮我安装「Code Manual」这个 Skill：克隆 https://github.com/yschdxm/code-manual 到临时目录，把仓库根的 SKILL.md 和 template.py 复制到 ~/.claude/skills/code-manual/（如果只想要当前项目生效，就放 <项目根>/.claude/skills/code-manual/），然后删掉临时目录。装完向我确认装的路径。
```

要装英文版请用 [English README](README.en.md) 里的提示词。安装后在任意项目里说：

```text
给这个项目做一个代码手册
```

## 技术要点

- **Skill 格式**：YAML frontmatter（`name` + 触发式 `description`）+ Markdown 流程正文
- **生成器**：Python 3 标准库（`ast` 解析 docstring、`json` 内嵌数据、`pathlib` 扫描），无第三方依赖
- **手册前端**：零依赖单文件 HTML/CSS/JS——多级树、搜索联动、按行区间 `fetch` 源码并轻量高亮
- **安全**：内嵌 JSON 先转义 `<`（防 `</script>` 提前闭合），所有 HTML 插值统一走 `esc()`

## 快速安装

1. 复制上面的提示词给 Agent（或手动把 `SKILL.md` + `template.py` 放进 `~/.claude/skills/code-manual/`，英文版用 `SKILL.en.md` 重命名为 `SKILL.md`）
2. 重启会话，确认技能列表出现 `code-manual`

## 架构（概述）

Skill 文档层（指导 Agent 执行七阶段流程）与 `template.py` 生成器层（扫描源码 → 注入转义 JSON → 渲染单文件 HTML）分离；手册只存 `src`/`ln` 指针，源码运行时按需加载。

## 项目结构

```
code-manual/
├── SKILL.md          # 中文版 Skill(默认)
├── SKILL.en.md       # 英文副本(安装时重命名为 SKILL.md)
├── template.py       # 双语生成器模板
├── README.md         # 本文件
├── README.en.md      # 英文版 README
├── LICENSE           # MIT
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
