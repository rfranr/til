---
title: List AWS Resources from Command Line
description: Useful AWS CLI commands to list resources.
author: rfranr
date: 2025-09-26
tags: [#aws, #cli, #resources]
---

## List enabled scheduled EventBridge rules

```
aws events list-rules \
  --query "Rules[?ScheduleExpression!=null && State=='ENABLED'].[Name,ScheduleExpression]" \
  --output table
```

This command lists all enabled EventBridge rules with a schedule expression in a table format.
