[Русский](READMERU.md) | **English**
# IkuzaChat - chat created with love <3

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.2-blue.svg)](https://github.com/ikuza47/ikuzachat)

**IkuzaChat** is a Twitch chat overlay with a wide range of customization options to suit everyone.

## ✨ What does the chat have?

- Modern settings page design for easy and enjoyable creation of the overlay of your dreams
- Fully customizable chat settings to suit your preferences
- Support for emojis from 7TV, BTTV, FFZ and Twitch
- Flexible font settings with a choice of several popular fonts, as well as the ability to upload your own
- Auto-delete messages after a set period of time
- Auto-clear chat when using the /clear command in Twitch
- Animations for message appearance and disappearance
- Modularity: The highlight of this chat is its modules, more about them in another section
- Proper emoji replacement that doesn't break text sequences like "((( "
- Colored user mentions with personalized colors
- Time display customization with timezone support

---
### Using via the website

1. **Open [website](https://ikuza.space/)**

2. **Configure the overlay**
- Enter the name of your Twitch channel
- Configure the font and other settings
- Click "Copy link"

3. **Add Overlay in OBS**
- Add a new "Browser" source to OBS
- Paste the generated link into the URL field
- Set the appropriate dimensions
- Disable "Curse Capture" (optional)
---
### Installing on your PC (Recommended)

1. **Clone the repository**
```bash
git clone https://github.com/ikuza47/ikuzachat.git
cd ikuzachat
```

2. **Run index.html**

3. **Configure the overlay**
- Enter your Twitch channel name
- Adjust the font and other settings
- Click "Copy link"

4. **Add the overlay to OBS**
- Add a new "Browser" source to OBS
- Paste the generated link into the URL field
- Set the appropriate dimensions
- Disable "Curse Capture" (optional)
---
## Modules
- **osu! module**: Enables support for displaying osu! map info from a link (API key required)
- **Bot blocker module**: Hide messages from bots (list loaded from GitHub)

---
## 📖 Plans
- [X] OSU Module (Basic)
- [X] Colored User Mentions
- [X] User-Friendly Settings Page
- [X] Proper emoji replacement (preventing text breakage like "((( ")
- [ ] Twitch Emoji Support (through tags)
- [ ] Presets
- [X] Message Reading Fix
- [X] Message Sent Time Display Setting
- [ ] User First Message Mark
- [ ] Sound Effect Setting with Cooldown, etc.
- [X] Message Ignoring Setting
- [ ] Commands
- [X] Modules

## 🤝 How to Contribute

We welcome any suggestions for improving the project! Here's how you can help:

1. Suggest a chat idea
2. Report a bug
3. Create a fork
4. Help with bug fixes

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ❤️ Support
If you liked the chat and want to see it grow into something bigger, you can help: [click](https://boosty.to/ikuza47)

## 🙏 Thanks

Thanks for using IkuzaChat! If you like the project, don't forget to give it a ⭐ star on GitHub.

Created with ❤️ for those looking for the perfect Twitch chat

---

**IkuzaChat** © 2025 - Twitch Chat Overlay | Developed by ikuza47