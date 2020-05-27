const app = require("../server"); // Link to your server file
const supertest = require("supertest");
const request = supertest(app);
const { getDb } = require("../connector/db");

const errorPost = "You need to have valid id and/or max_capacity";
const errorGet = "You need to have capacity_required";

describe("Dispatcher route GET couriers/lookup", () => {
  it("without body", async (done) => {
    const response = await request.get("/couriers/lookup");
    expect(response.status).toBe(500);
    expect(response.body.error).toBe(errorGet);
    done();
  });

  it("with the right body", async (done) => {
    const response = await request
      .get("/couriers/lookup")
      .send({ capacity_required: 10 })
      .set("Accept", "application/json");
    // .expect('Content-Type', /json/)

    expect(response.status).toBe(200);
    // expect(response.body.message).toBe("You need to have capacity_required!");
    done();
  });

  it("with the wrong body format", async (done) => {
    const response = await request
      .get("/couriers/lookup")
      .send({ random_prop: 3 });
    expect(response.status).toBe(500);
    expect(response.body.error).toBe(errorGet);
    done();
  });
});

describe("Stuart API routes Post couriers", () => {
  it("with right data", async (done) => {
    // Clean up
    const db = await getDb();
    await db.collection("courier").deleteOne({ _id: 77777777 });

    const response = await request
      .post("/couriers")
      .send({ id: 77777777, max_capacity: 24 })
      .set("Accept", "application/json");

    expect(response.status).toBe(200);

    // Clean up
    await db.collection("courier").deleteOne({ _id: 77777777 });

    done();
  });

  it("with right data", async (done) => {
    // Clean up
    const db = await getDb();
    await db.collection("courier").deleteOne({ _id: 77777777 });

    const response = await request
      .post("/couriers")
      .send({ id: 77777777, max_capacity: 24 })
      .set("Accept", "application/json");
    expect(response.status).toBe(200);
    // Clean up
    await db.collection("courier").deleteOne({ _id: 77777777 });

    done();
  });

  it("with existing id", async (done) => {
    // Clean up
    const db = await getDb();
    await db.collection("courier").deleteOne({ _id: 77777777 });

    const response = await request
      .post("/couriers")
      .send({ id: 77777777, max_capacity: 24 })
      .set("Accept", "application/json");
    expect(response.status).toBe(200);

    const response2 = await request
      .post("/couriers")
      .send({ id: 77777777, max_capacity: 24 })
      .set("Accept", "application/json");
    expect(response2.status).toBe(500);
    expect(response2.body.error).toBe("Something has failed.");

    // Clean up
    await db.collection("courier").deleteOne({ _id: 77777777 });

    done();
  });

  it("without body", async (done) => {
    const response = await request.post("/couriers");
    expect(response.status).toBe(500);
    expect(response.body.error).toBe(errorPost);
    done();
  });

  it("wrong body properties", async (done) => {
    const response = await request.post("/couriers").send({ random_prop: 3 });
    expect(response.status).toBe(500);
    expect(response.body.error).toBe(errorPost);
    done();
  });

  it("missing properties", async (done) => {
    const response = await request.post("/couriers").send({ id: 77777777 });
    expect(response.status).toBe(500);
    expect(response.body.error).toBe(errorPost);

    const response2 = await request.post("/couriers").send({ max_capacity: 1 });
    expect(response2.status).toBe(500);
    expect(response2.body.error).toBe(errorPost);
    done();
  });
});

describe("Stuart API routes Patch couriers", () => {
  it("with existing id but patch missing properties", async (done) => {
    // Create data
    const db = await getDb();
    await db
      .collection("courier")
      .insertOne({ _id: 77777777, max_capacity: 10 });

    const response2 = await request.patch("/couriers/change_capacity/77777777");
    expect(response2.status).toBe(500);
    expect(response2.body.error).toBe(errorPost);

    // Clean up
    await db.collection("courier").deleteOne({ _id: 77777777 });

    done();
  });

  it("with non existing id", async (done) => {
    const response2 = await request
      .patch("/couriers/change_capacity/77777777")
      .send({ max_capacity: 1 });
    expect(response2.status).toBe(200);
    expect(response2.body.nModified).toBe(0);

    done();
  });

  it("with existing id", async (done) => {
    // Create data
    const db = await getDb();
    await db
      .collection("courier")
      .insertOne({ _id: 77777777, max_capacity: 10 });

    const response2 = await request
      .patch("/couriers/change_capacity/77777777")
      .send({ max_capacity: 1 });
    expect(response2.status).toBe(200);
    expect(response2.body.nModified).toBe(1);
    expect(response2.body.n).toBe(1);

    // Clean up
    await db.collection("courier").deleteOne({ _id: 77777777 });
    done();
  });

  it("with existing id with same capacity", async (done) => {
    // Create data
    const db = await getDb();
    await db
      .collection("courier")
      .insertOne({ _id: 77777777, max_capacity: 10 });

    const response2 = await request
      .patch("/couriers/change_capacity/77777777")
      .send({ max_capacity: 10 });
    expect(response2.status).toBe(200);
    expect(response2.body.nModified).toBe(0);
    expect(response2.body.n).toBe(1);

    // Clean up
    await db.collection("courier").deleteOne({ _id: 77777777 });
    done();
  });
});

describe("Stuart API routes Delete couriers", () => {
  it("with non existing id", async (done) => {
    const response2 = await request.delete("/couriers/77777777");
    expect(response2.status).toBe(200);
    expect(response2.body.n).toBe(0);

    done();
  });

  it("with wrong id type", async (done) => {
    const response2 = await request.delete("/couriers/string");
    expect(response2.status).toBe(500);
    expect(response2.body.error).toBe("You need to have valid id");

    done();
  });

  it("with right data", async (done) => {
    // Create data
    const db = await getDb();
    await db
      .collection("courier")
      .insertOne({ _id: 77777777, max_capacity: 10 });

    const response2 = await request.delete("/couriers/77777777");
    expect(response2.status).toBe(200);
    expect(response2.body.n).toBe(1);

    // Clean up
    const check = await db.collection("courier").findOne({ _id: 77777777 });
    expect(check).toBe(null);

    done();
  });
});
