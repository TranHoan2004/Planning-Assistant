build:
	@bazelisk build //...

generate-build:
	@bazelisk run //:gazelle

create-py-venv:
	@bazelisk run //requirements:create_venv

update-py-deps:
	chmod +x tools/repin.sh && tools/repin.sh

update-preset:
	@bazelisk run //tools:preset.update

format:
	@bazelisk run //:format

clean:
	@bazelisk clean
