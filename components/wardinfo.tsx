import { WardWorker } from "../lib/constants";
import { genLsgTitle } from "../lib/utils";

type WardInfoProps = {
  district: string;
  lsg: string;
  type: RRT.LsgdVariant;
  ward: {
    name: string;
    wardNo: number;
    medicalOfficer: RRT.ContactType;
    ashaWorker: RRT.ContactType;
    lsgdWardMember: RRT.ContactType;
    kudumbaShree: RRT.ContactType;
    anganawadiTeacher: RRT.ContactType;
  };
};

export default function WardInfo({ district, lsg, type, ward }: WardInfoProps) {
  return (
    <table className="table-auto border-separate">
      <tbody>
        <tr>
          <td>Ward No</td>
          <td>{ward.wardNo}</td>
        </tr>
        <tr>
          <td>Ward Name</td>
          <td>{ward.name}</td>
        </tr>
        <tr>
          <td>LSG Name</td>
          <td>{genLsgTitle(lsg, type)}</td>
        </tr>
        <tr>
          <td>District</td>
          <td>{district}</td>
        </tr>
        {Object.keys(WardWorker).map((k) => (
          <tr key={k}>
            <td>{WardWorker[k]}</td>
            <td>
              <tr>
                <td>Name</td>
                <td>{ward[k].name}</td>
              </tr>
              <tr>
                <td>Contact</td>
                <td>{ward[k].contact}</td>
              </tr>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
