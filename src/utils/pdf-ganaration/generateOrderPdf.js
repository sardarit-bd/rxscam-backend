import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import getTotalPrice from "../getTotalPrice.js";




import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);





async function generateOrderPdf(data, orderID) {


    const doc = new jsPDF({ unit: "pt", format: "a4" });

    const pageW = doc.internal.pageSize.getWidth();
    const margin = 40;
    const contentW = pageW - margin * 2;

    let y = 50;


    console.log(data);


    // ── BRANDING HEADER ─────────────────────────────────────────


    const logoPath = path.join(__dirname, "../../assest/logo.png");
    const logoBase64 = fs.readFileSync(logoPath, { encoding: "base64" });

    const logo = `data:image/png;base64,${logoBase64}`;


    // Logo
    doc.addImage(logo, "PNG", 30, 30, 180, 60);



    // Client Info Box
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);

    let clientY = 35;

    doc.text(`Client: ${data?.fullname || ""}`, pageW - 40, clientY, { align: "right" });
    clientY += 14;
    doc.text(`Email: ${data?.email || ""}`, pageW - 40, clientY, { align: "right" });
    clientY += 14;
    doc.text(`Phone: ${data?.phone || ""}`, pageW - 40, clientY, { align: "right" });
    clientY += 14;
    doc.text(`Address: ${data?.address || ""}`, pageW - 40, clientY, { align: "right" });
    clientY += 18;
    doc.text(`Order ID: ${orderID || ""}`, pageW - 40, clientY, { align: "right" });

    y += 40;


    y += 35;

    // SUBTITLE
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(30, 30, 30);
    doc.text("Prescription", pageW / 2, y, { align: "center" });

    y += 30;

    // SECTION LABEL
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(100, 120, 140);
    doc.text("Prescription Details", 40, y);

    y += 10;

    // PRESCRIPTION TABLE
    const rxHead = [["", "SPH", "CYL", "Axis", "ADD", data?.hasData[0]?.pdType == "1" ? "S-PD" : "D-PD"]];


    const isDualPD = data?.hasData[0]?.pdType == "2";

    const odRow = [
        "OD",
        data?.hasData[0]?.sph?.rightSph,
        data?.hasData[0]?.cyl?.rightCyl,
        data?.hasData[0]?.axis?.rightAxis,
        data?.hasData[0]?.add?.rightAdd,
    ];

    const osRow = [
        "OS",
        data?.hasData[0]?.sph?.leftSph,
        data?.hasData[0]?.cyl?.leftCyl,
        data?.hasData[0]?.axis?.leftAxis,
        data?.hasData[0]?.add?.leftAdd,
    ];



    if (!isDualPD) {
        // D-PD → single value → span 2 rows
        odRow.push({
            content: data?.hasData[0]?.singlePD,
            rowSpan: 2
        });

        // OS row gets NO PD column
    } else {
        // S-PD → separate values
        odRow.push(data?.hasData[0]?.dualPD?.rightPD);
        osRow.push(data?.hasData[0]?.dualPD?.leftPD);
    }

    const rxBody = [odRow, osRow];


    autoTable(doc, {
        startY: y,
        head: rxHead,
        body: rxBody,
        theme: "grid",
        margin: { left: 40, right: 40 },
        headStyles: {
            fillColor: [245, 245, 245],
            textColor: [40, 40, 40],
            fontStyle: "bold",
            halign: "center",
            fontSize: 10,
        },
        bodyStyles: {
            halign: "center",
            textColor: [50, 50, 50],
            fontSize: 10,
        },
        columnStyles: {
            0: { halign: "center", fontStyle: "bold" },
        },
        styles: {
            lineColor: [200, 200, 200],
            lineWidth: 0.5,
        },
    });

    y = doc.lastAutoTable.finalY + 20;

    // PRISM TABLE
    const prismHead = [
        [
            "",
            "Vertical Prism",
            "Base Direction",
            "Horizontal Prism",
            "Base Direction",
        ],
    ];
    const prismBody = [
        [
            "OD",
            data?.hasData[0]?.rightPrism?.vertical,
            data?.hasData[0]?.rightPrism?.vBaseDirection,
            data?.hasData[0]?.rightPrism?.horizontal,
            data?.hasData[0]?.rightPrism?.hBaseDirection,
        ],
        [
            "OS",
            data?.hasData[0]?.leftPrism?.vertical,
            data?.hasData[0]?.leftPrism?.vBaseDirection,
            data?.hasData[0]?.leftPrism?.horizontal,
            data?.hasData[0]?.leftPrism?.hBaseDirection,
        ],
    ];


    if (data?.hasData[0]?.addPrism) {

        autoTable(doc, {
            startY: y,
            head: prismHead,
            body: prismBody,
            theme: "grid",
            margin: { left: 40, right: 40 },
            headStyles: {
                fillColor: [245, 245, 245],
                textColor: [40, 40, 40],
                fontStyle: "bold",
                halign: "center",
                fontSize: 10,
            },
            bodyStyles: {
                halign: "center",
                textColor: [50, 50, 50],
                fontSize: 10,
            },
            columnStyles: {
                0: { halign: "center", fontStyle: "bold" },
            },
            styles: {
                lineColor: [200, 200, 200],
                lineWidth: 0.5,
            },
        });
    }


    y = doc.lastAutoTable.finalY + 25;


    // LINE ITEMS
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);

    data.hasData[0].total.forEach((item) => {
        doc.setFont("helvetica", "normal");
        doc.text(item?.target, 40, y);
        doc.text(` : ${" " + item?.name}`, 100, y);
        doc.text(`£${item?.price}`, pageW - 40, y, { align: "right" });
        y += 20;
    });

    // DIVIDER
    y += 5;
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.7);
    doc.line(40, y, pageW - 40, y);
    y += 18;

    // SUBTOTAL
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(20, 20, 20);
    doc.text("Subtotal", 40, y);
    const totalPrice = getTotalPrice(data.hasData[0].total);
    doc.text(`£${totalPrice.toString()}`, pageW - 40, y, { align: "right" });


    // return pdf as base64 string
    const base64 = doc.output("datauristring").split(",")[1];
    return base64;
}

export default generateOrderPdf;
