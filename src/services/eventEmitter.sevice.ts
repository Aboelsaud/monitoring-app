import EventEmitter from "events";

export const eventEmitter = new EventEmitter();


eventEmitter.on("createCheck", (check) => {
  //const interval = startInterval(check);
});
