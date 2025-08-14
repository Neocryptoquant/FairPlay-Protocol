import { createCodamaConfig } from "gill";
 
export default createCodamaConfig({
  idl: "target/idl/fairplay.json",
  clientJs: "clients/js/src/generated",
});