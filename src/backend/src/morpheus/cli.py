import argparse


def main() -> None:
    parser = argparse.ArgumentParser(prog='morpheus')
    subparsers = parser.add_subparsers(dest='command', required=True)
    subparsers.add_parser('sync-uit-sensors')
    subparsers.add_parser('reproject-project-summaries')
    subparsers.add_parser('reproject-preview-images')
    args = parser.parse_args()

    if args.command == 'sync-uit-sensors':
        from morpheus.sensor.presentation.cli import read_uit_sensor_data_from_csv_files_cli_command

        read_uit_sensor_data_from_csv_files_cli_command()
    elif args.command == 'reproject-project-summaries':
        from morpheus.project.presentation.cli.ProjectionCliCommands import ReprojectProjectSummariesCliCommand

        ReprojectProjectSummariesCliCommand.run()
    else:
        from morpheus.project.presentation.cli.ProjectionCliCommands import ReprojectPreviewImagesCliCommand

        ReprojectPreviewImagesCliCommand.run()


if __name__ == '__main__':
    main()
