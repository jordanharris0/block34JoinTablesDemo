const express = require("express");
const app = express();
const PORT = 3000;

const prisma = require("./prisma");

//middleware
app.use(express.json());
app.use(require("morgan")("dev"));

//error handling
app.use((error, req, res, next) => {
  res.status(res.status || 500).send({ error: error });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

//GET ALL USERS
app.get("/api/users", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    next(error);
  }
});

//GET ALL PLACES
app.get("/api/places", async (req, res, next) => {
  try {
    const places = await prisma.place.findMany();
    res.json(places);
  } catch (error) {
    next(error);
  }
});

//GET ALL VACATIONS
app.get("/api/vacations", async (req, res, next) => {
  try {
    const vacations = await prisma.vacation.findMany();
    res.json(vacations);
  } catch (error) {
    next(error);
  }
});

//POST
app.post("api/users/:id/vacations", async (req, res, next) => {
  try {
    //get user id '+' turns id into Int
    const userId = +req.params.id;
    //get place id and travel date of user
    const { placeId, travelDate } = req.body;
    //post info to vacations
    const vacation = await prisma.vacation.create({
      data: {
        userId,
        placeId,
        travelDate,
      },
    });
    res.sendStatus(201);
    res.json(vacation);
  } catch (error) {
    next(error);
  }
});

//DELETE
app.delete("/api/users/:userId/vacations/:id", async (req, res, next) => {
  try {
    //get id
    const id = +req.params.id;
    //get vacation by id
    const vacationExists = await prisma.vacation.findFirst({
      where: { id },
    });

    //error handling
    if (!vacationExists) {
      return next({
        status: 404,
        message: `Could not find vacation with id ${id}`,
      });
    }
    //delete user
    await prisma.vacation.delete({ where: { id } });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});
