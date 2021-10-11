import Phaser from "phaser";
import { StepComponent } from "../components/StepComponent";
import { DisplayData } from "../models/display-data";

export default class Demo extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }
  steps: StepComponent[] = [];
  title?: Phaser.GameObjects.Text = undefined;
  logo?: Phaser.GameObjects.Image = undefined;
  displayData?: DisplayData = undefined;

  preload() {
    this.load.svg("logo", "assets/logo.svg", { scale: 3.0 });
  }

  async create() {
    this.logo = this.add.image(940, 70, "logo");
    setInterval(() => {
      this.addTween();
    }, 15000);
    this.addTween();

    const res = await fetch("http://localhost:3002");
    const data = (await res.json()) as DisplayData;
    this.displayData = data;
    console.log(data);
    this.createElements(data);

    this.scrollCameraToIndex(data.currentStep);

    //scroll camera
    this.input.on("wheel", (e: any) => {
      this.cameras.main.scrollY += e.deltaY;
      this.updateStepOpacity();
      this.updateLogoPosition();
    });

    const evtSource = new EventSource("http://localhost:3002/sse");
    evtSource.onmessage = (e: MessageEvent) => {
      const data = JSON.parse(e.data) as DisplayData;
      this.displayData = data;
      // this.createElements(data);
      this.scrollCameraToIndex(data.currentStep);
    };
  }

  createElements(data: DisplayData) {
    this.title = this.add.text(960, 210, data.title, {
      fontSize: "112px",
    });
    this.title.setOrigin(0.5);
    let y = 400;
    data.steps.forEach((s) => {
      const stepComponent = new StepComponent(s, this, 50, y);
      this.steps.push(stepComponent);
      y += stepComponent.height;
    });
    console.log(data.currentStep);
    this.updateStepOpacity();
  }
  updateStepOpacity() {
    let index = 0;
    this.steps.forEach((step) => {
      if (index === this.displayData?.currentStep) {
        step.titleLabel.setColor("#ee5c25");
      } else {
        step.titleLabel.setColor("#ffffff");
      }
      const y =
        540 - Math.abs(step.titleLabel.y - (this.cameras.main.scrollY + 540));
      const opacity = y / 540;
      step.titleLabel.setAlpha(opacity);
      step.descriptionLabel.setAlpha(opacity);
      index++;
    });
  }

  scrollCameraToIndex(index: number) {
    const step = this.steps[index];
    if (!step) {
      return;
    }
    const y = step.titleLabel.y;
    this.cameraTweenTo(y - 540);
    this.updateStepOpacity();
    this.updateLogoPosition();
  }
  updateLogoPosition() {
    this.logo?.setY(this.cameras.main.scrollY + 70);
    this.title?.setY(this.cameras.main.scrollY + 210);
  }
  addTween() {
    this.tweens.add({
      targets: this.logo,
      scaleX: -1,
      duration: 200,
      ease: "Sine.inOut",
      yoyo: true,
      repeat: 2,
    });
  }
  cameraTweenTo(y: number) {
    this.tweens.add({
      targets: this.cameras.main,
      scrollY: y,
      duration: 1000,
      ease: "Sine.inOut",
      onUpdate: () => {
        this.updateLogoPosition();
        this.updateStepOpacity();
      },
    });
  }
}
