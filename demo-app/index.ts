import fs from "fs";
import path from "path";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import chalk from "chalk";
import { Logger } from "log-client/src/logger";

const rl = readline.createInterface({ input, output });

interface Todo {
  id: number;
  task: string;
  completed: boolean;
}

const DB_FILE = path.join(__dirname, "todos.json");

class TodoApp {
  private todos: Todo[] = [];
  private logger!: Logger;
  private serviceId: string = "";

  async init() {
    console.clear();
    console.log(
      chalk.blue.bold("=== Welcome to the Interactive TODO Demo ==="),
    );
    this.serviceId = await rl.question(
      chalk.yellow("Enter Service ID for logging: "),
    );

    this.logger = new Logger({
      serviceId: this.serviceId,
      endpoint: "http://localhost:3000/api/log",
      apiKey: "super-secret-logging-key-2026",
    });

    this.load();
    this.logger.log(`Session started for service: ${this.serviceId}`);
  }

  private load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const data = fs.readFileSync(DB_FILE, "utf-8");
        this.todos = JSON.parse(data);
        this.logger.log(`Database loaded. Count: ${this.todos.length}`);
      } else {
        this.todos = [];
        this.logger.warn("No database found, starting fresh.");
      }
    } catch (error: any) {
      this.logger.error(`Load error: ${error.message}`);
    }
  }

  private save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.todos, null, 2));
      this.logger.debug("Database saved.");
    } catch (error: any) {
      this.logger.error(`Save error: ${error.message}`);
    }
  }

  async run() {
    let exit = false;
    while (!exit) {
      console.log(chalk.cyan("\n--- MAIN MENU ---"));
      console.log("1. " + chalk.green("List Todos"));
      console.log("2. " + chalk.green("Add Todo"));
      console.log("3. " + chalk.green("Complete Todo"));
      console.log("4. " + chalk.green("Delete Todo"));
      console.log("5. " + chalk.red("Exit"));

      const choice = await rl.question("\nSelect an option: ");

      switch (choice) {
        case "1":
          this.listTodos();
          break;
        case "2":
          const task = await rl.question("Enter task description: ");
          this.addTodo(task);
          break;
        case "3":
          const completeId = await rl.question("Enter Todo ID to complete: ");
          this.completeTodo(parseInt(completeId));
          break;
        case "4":
          const deleteId = await rl.question("Enter Todo ID to delete: ");
          this.deleteTodo(parseInt(deleteId));
          break;
        case "5":
          exit = true;
          this.logger.log("Demo application closed.");
          console.log(chalk.magenta("Goodbye!"));
          break;
        default:
          console.log(chalk.red("Invalid option, try again."));
      }
    }
    rl.close();
  }

  listTodos() {
    console.log(chalk.bold("\nYour Tasks:"));
    if (this.todos.length === 0) {
      console.log(chalk.gray("No tasks yet."));
    } else {
      this.todos.forEach((todo) => {
        const status = todo.completed ? chalk.green("[X]") : chalk.red("[ ]");
        console.log(`${status} ${chalk.blue(todo.id)}: ${todo.task}`);
      });
    }
    this.logger.debug(`Listed ${this.todos.length} tasks.`);
  }

  addTodo(task: string) {
    if (!task) return;
    const newTodo: Todo = { id: Date.now(), task, completed: false };
    this.todos.push(newTodo);
    this.save();
    console.log(chalk.green("✓ Task added successfully!"));
    this.logger.log(`Added task: ${task}`);
  }

  completeTodo(id: number) {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = true;
      this.save();
      console.log(chalk.green(`✓ Task ${id} completed!`));
      this.logger.log(`Completed task ID: ${id}`);
    } else {
      console.log(chalk.red(`Error: Task ${id} not found.`));
      this.logger.warn(`Failed completion attempt: ID ${id}`);
    }
  }

  deleteTodo(id: number) {
    const initialLen = this.todos.length;
    this.todos = this.todos.filter((t) => t.id !== id);
    if (this.todos.length < initialLen) {
      this.save();
      console.log(chalk.yellow(`✓ Task ${id} deleted.`));
      this.logger.log(`Deleted task ID: ${id}`);
    } else {
      console.log(chalk.red(`Error: Task ${id} not found.`));
      this.logger.error(`Failed deletion attempt: ID ${id}`);
    }
  }
}

const app = new TodoApp();
app.init().then(() => app.run());
