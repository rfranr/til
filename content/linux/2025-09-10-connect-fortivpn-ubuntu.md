---
title: Connect to FortiVPN on Ubuntu using openfortivpn / openforticlient
date: 2025-09-10
tags: [#linux, #ubuntu, #vpn, #fortinet, #openfortivpn, #networking]
---

I learned how to connect to a Fortinet SSL VPN from Ubuntu without using Windows, thanks to **openfortivpn** (CLI) and the **openforticlient** GUI.

## Option A — CLI with `openfortivpn`

### Install
```bash
sudo apt update
sudo apt install openfortivpn