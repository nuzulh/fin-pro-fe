import { adminRoot, UserRole } from "./defaultValues";

const data = [
  {
    id: "dashboard",
    icon: "iconsminds-monitor-analytics",
    label: "menu.dashboard",
    to: `${adminRoot}/dashboard`,
    roles: [UserRole.DIREKTUR],
  },
  {
    id: "rka",
    icon: "iconsminds-mail-money",
    label: "menu.rka-title",
    to: `${adminRoot}/rka`,
    roles: [UserRole.STAFF],
    subs: [
      {
        icon: "iconsminds-dumbbell",
        label: "menu.beban",
        to: `${adminRoot}/rka/beban`,
        subs: [
          {
            label: "menu.biaya-operasional",
            to: `${adminRoot}/rka/beban/biaya-operasional`,
            subs: [
              {
                label: "menu.persekot",
                to: `${adminRoot}/rka/beban/biaya-operasional/persekot`,
              },
              {
                label: "menu.laporan-persekot",
                to: `${adminRoot}/rka/beban/biaya-operasional/laporan-persekot`,
              },
              {
                label: "menu.sppd",
                to: `${adminRoot}/rka/beban/biaya-operasional/sppd`,
              },
              {
                label: "menu.fee-project",
                to: `${adminRoot}/rka/beban/biaya-operasional/fee-project`,
              },
            ],
          },
          {
            label: "menu.prokurmen",
            to: `${adminRoot}/rka/beban/prokurmen`,
            subs: [
              {
                label: "menu.rpb",
                to: `${adminRoot}/rka/beban/prokurmen/rpb`,
              },
            ],
          },
          {
            icon: "iconsminds-24-hour",
            label: "menu.rab-progres",
            to: `${adminRoot}/rka/beban/rab-progres`,
          },
        ],
      },
    ],
  },
];
export default data;
