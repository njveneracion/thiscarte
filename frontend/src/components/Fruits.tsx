interface FruitsProps {
  name: string;
  color: string;
  isRipe: boolean;
  qty: number;
}

const Fruits = (props: FruitsProps) => {
  return (
    <div className="font-mono text-lg table-auto">
      <table>
        <thead>
          <tr className="bg-red-200 flex gap-2 justify-between ">
            <th>Name</th>
            <th>Color</th>
            <th>Ripe</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          <tr className="flex gap-2 justify-between align-middle">
            <td>{props.name}</td>
            <td>{props.color}</td>
            <td>{props.isRipe ? "Yes" : "No"}</td>
            <td>{props.qty}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Fruits;
