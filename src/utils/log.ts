import chalk from 'chalk';

const log = console.log;

export const sucLog = (text: string) => {
  log(chalk.bold.green(text));
};

export const keyword = (color: string) => chalk.keyword(color);
