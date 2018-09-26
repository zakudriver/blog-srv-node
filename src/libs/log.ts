import chalk from 'chalk';

const log = console.log;

export const sucLog = (text: string) => {
  log(chalk.bold.green(text));
};

export const errLog = (text: string) => {
  log(keyword('orange')('Error: ') + chalk.bold.red(text));
};

export const terminalLog = (text: string) => {
  log(chalk.bold.yellow(text));
};


export const keyword = (color: string) => chalk.keyword(color);
