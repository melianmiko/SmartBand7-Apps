class CustomizeScreen {
  userTiels = null;
  settings = null;

  _load() {
    try {
      this.settings = FsUtils.fetchJSON("settings.json");
    } catch(e) {
      console.log(e);
      this.settings = {
        tiles: ["apps", "files"],
        withBrightness: true
      };
    }
  }

  start () {
    this._load();

    const brightnessToggle = hmUI.createWidget(hmUI.widget.IMG, {
      x: 12,
      y: 72,
      src: "brightness_cfg.png",
      alpha: this.settings.withBrightness ? 255 : 100
    });

    brightnessToggle.addEventListener(hmUI.event.CLICK_UP, () => {
      this.settings.withBrightness = !this.settings.withBrightness;
      brightnessToggle.setProperty(hmUI.prop.MORE, {
        alpha: this.settings.withBrightness ? 255 : 100
      })
    })

    Object.keys(QS_BUTTONS).forEach((id, i) => {
      const config = QS_BUTTONS[id];
      if(!config) return;

      const x = 12 + (i % 2) * 90;
      const y = 164 + Math.floor(i / 2) * 90;

      const btn = hmUI.createWidget(hmUI.widget.IMG, {
        x,
        y,
        w: 78,
        h: 78,
        alpha: this.settings.tiles.indexOf(id) > -1 ? 255 : 100,
        src: id + ".png",
      });

      btn.addEventListener(hmUI.event.CLICK_UP, () => {
        hmUI.showToast({text: t("qs_" + id)})
        this._toggleTile(id, btn);
      });
    });

    const end_y = 176 + Math.ceil(Object.keys(QS_BUTTONS).length / 2) * 90;
    hmUI.createWidget(hmUI.widget.TEXT, {
      x: 0,
      y: end_y,
      w: 192,
      h: 72,
      text: ""
    });
  }

  finish() {
    FsUtils.writeText("settings.json", JSON.stringify(this.settings));
  }

  _toggleTile(id, btn) {
    const ind = this.settings.tiles.indexOf(id);

    if(ind < 0) {
      this.settings.tiles.push(id);
      btn.setProperty(hmUI.prop.MORE, {alpha: 255})
    } else {
      this.settings.tiles = this.settings.tiles.filter((i) => i !== id);
      console.log(this.settings.tiles);
      btn.setProperty(hmUI.prop.MORE, {alpha: 100})
    }
  }
}
