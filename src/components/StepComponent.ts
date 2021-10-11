import { Step } from "../models/step";

export class StepComponent {
  step: Step;
  titleLabel: Phaser.GameObjects.Text;
  descriptionLabel: Phaser.GameObjects.Text;
  height: number;
  constructor(step: Step, scene: Phaser.Scene, x: number, y: number) {
    this.step = step;
    this.titleLabel = scene.add.text(x, y, step.title, {
      fontFamily: "Arial",
      fontSize: "54px",
      color: "#ffffff",
    });
    this.descriptionLabel = scene.add.text(x, y + 150, step.description, {
      fontFamily: "Arial",
      fontSize: "36px",
      color: "#ffffff",
    });

    this.titleLabel.setOrigin(0, 0);
    this.descriptionLabel.setOrigin(0, 0);
    this.height =
      this.titleLabel.getBounds().height +
      this.descriptionLabel.getBounds().height +
      300;
  }
}
